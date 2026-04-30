package com.mihnea.restapi.Services;

import com.mihnea.restapi.dtos.ChatApiMessageDTO;
import com.mihnea.restapi.dtos.MessageDTO;
import com.mihnea.restapi.dtos.MovieDTO;
import com.mihnea.restapi.dtos.Requests.ChatRequest;
import com.mihnea.restapi.dtos.Response.ChatParsedResult;
import com.mihnea.restapi.dtos.Response.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final RestClient restClient;
    private final RecommendationService recommendationService;
    private final MovieWatchListService movieWatchListService;
    private final UserMovieLogService userMovieLogService;


    private final Map<String, List<MessageDTO>> chatHistory = new ConcurrentHashMap<>();

    public ChatParsedResult getAiResponse(String userPrompt, Authentication authentication) {
        String username = authentication.getName();
        String systemInstruction = buildSystemInstruction(authentication);

        List<MessageDTO> messageDTOS = chatHistory.computeIfAbsent(username, k -> {
            List<MessageDTO> initial = new ArrayList<>();
            initial.add(new MessageDTO("system", systemInstruction));
            return initial;
        });

        messageDTOS.set(0, new MessageDTO("system", systemInstruction));
        messageDTOS.add(new MessageDTO("user", userPrompt));

        if (messageDTOS.size() > 11) {
            messageDTOS.remove(1);
        }

        // --- FIX START: Strip 'movies' before sending to external API ---
        List<ChatApiMessageDTO> apiMessages = messageDTOS.stream()
                .map(m -> new ChatApiMessageDTO(m.role(), m.content()))
                .toList();

        // Pass apiMessages to the request, NOT the original messages list
        ChatRequest request = new ChatRequest("llama-3.3-70b-versatile", apiMessages);
        // --- FIX END ---

        ChatResponse response = restClient.post()
                .body(request)
                .retrieve()
                .body(ChatResponse.class);

        if (response == null || response.choices().isEmpty()) {
            return new ChatParsedResult("Error", List.of());
        }

        String aiAnswer = response.choices().get(0).messageDTO().content();
        ChatParsedResult parsed = parseAiResponse(aiAnswer);

        // Save the enriched message (with movies) to your internal history
        messageDTOS.add(new MessageDTO("assistant", parsed.message(), parsed.movies()));

        return parsed;
    }
    private ChatParsedResult parseAiResponse(String rawContent) {
        // 1. Clean up the content (sometimes AI adds markdown backticks or extra whitespace)
        String cleanContent = rawContent.replace("```", "").trim();

        // 2. Updated Regex:
        // ^(?:Message\s*:\s*)? -> Optional "Message:" at the start
        // (.*?)                -> Captures the text into Group 1
        // \n?\s*Movies\s*:\s* -> Looks for "Movies:" (case insensitive via flag)
        // (.*)$                -> Captures the list into Group 2
        Pattern pattern = Pattern.compile("^(?:Message\\s*:\\s*)?(.*?)\\s*Movies\\s*:\\s*(.*)$",
                Pattern.DOTALL | Pattern.CASE_INSENSITIVE);

        Matcher matcher = pattern.matcher(cleanContent);

        if (matcher.find()) {
            String messagePart = matcher.group(1).trim();
            String moviesPart = matcher.group(2).trim();

            // Remove any trailing punctuation from the message if it ends right at the label
            messagePart = messagePart.replaceAll("\\n+$", "");

            List<String> movies = Arrays.stream(moviesPart.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();

            return new ChatParsedResult(messagePart, movies);
        }

        // Fallback: If no "Movies:" label found, return raw text
        return new ChatParsedResult(cleanContent, List.of());
    }


    public void clearHistory(Authentication authentication) {
        chatHistory.remove(authentication.getName());
    }
    public List<MessageDTO> getHistory(Authentication authentication) {
        return chatHistory.get(authentication.getName());
    }

    private String buildSystemInstruction(Authentication authentication) {
        List<MovieDTO> recommendedDtos = recommendationService.getRecommendations(authentication);
        List<MovieDTO> watchedMoviesDtos = userMovieLogService.getUserLoggedMovies(authentication);
        List<MovieDTO> watchlistMoviesDtos = movieWatchListService.getUserWatchlist(authentication);

        String watchedTitles = String.join(", ", MovieDTO.toTitleList(watchedMoviesDtos));
        String recommendedTitles = String.join(", ", MovieDTO.toTitleList(recommendedDtos));
        String watchlistTitles = String.join(", ", MovieDTO.toTitleList(watchlistMoviesDtos));

        return """
               # ROLE
                           Expert Cinema Assistant.

                           # KNOWLEDGE BASE
                           - User's Watched: %s
                           - Curated Suggestions: %s
                           - User's Watchlist: %s
                
                           # CRITICAL DIRECTIVE (READ CAREFULLY)
                           - If the user specifies a genre (e.g., "romantic", "scary", "horror"), you MUST provide 1-3 movies of THAT genre immediately.
                           - IGNORE the 'Curated Suggestions' list if those movies do not match the genre the user requested.\s
                           - If the user asks for "Romantic" and the Curated list is Sci-Fi, suggest any famous Romantic movies instead.
                           - Start with a greeting and then give the list.
                           - Never ask "What kind of movies do you like?" if the user already mentioned a genre.
                           -YOU ARE STRICTLY AN EXPERT CINEMA ASSISTANT, YOU WILL ONLY RECOMMEND MOVIES EVEN IF ASKED OTHERWISE
                           # FORMAT
                         Message: <Your text here>
                         Movies: <Movie 1>, <Movie 2>, <Movie 3>
            """.formatted(watchedTitles, recommendedTitles, watchlistTitles);
    }
}