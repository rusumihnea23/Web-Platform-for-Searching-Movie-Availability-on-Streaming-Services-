package com.mihnea.restapi.Services;

import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.Message;
import com.mihnea.restapi.dtos.MovieDTO;
import com.mihnea.restapi.dtos.Requests.ChatRequest;
import com.mihnea.restapi.dtos.Response.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final RestClient restClient;
    private final RecommendationService recommendationService;
    private final MovieWatchListService movieWatchListService;
    private final UserMovieLogService userMovieLogService;


    private final Map<String, List<Message>> chatHistory = new ConcurrentHashMap<>();

    public String getAiResponse(String userPrompt, Authentication authentication) {
        String username = authentication.getName();

        String systemInstruction = buildSystemInstruction(authentication);

        List<Message> messages = chatHistory.computeIfAbsent(username, k -> {
            List<Message> initial = new ArrayList<>();
            initial.add(new Message("system", systemInstruction));
            return initial;
        });

        messages.set(0, new Message("system", systemInstruction));

        messages.add(new Message("user", userPrompt));

        if (messages.size() > 11) {
            messages.remove(1);
        }

        ChatRequest request = new ChatRequest("llama-3.3-70b-versatile", messages);

        ChatResponse response = restClient.post()
                .body(request)
                .retrieve()
                .body(ChatResponse.class);

        if (response == null || response.choices().isEmpty()) {
            return "We are sorry, the Ai coldn't generate a response.";
        }

        String aiAnswer = response.choices().get(0).message().content();


        messages.add(new Message("assistant", aiAnswer));

        return aiAnswer;
    }


    public void clearHistory(Authentication authentication) {
        chatHistory.remove(authentication.getName());
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
                           - If the user specifies a genre (e.g., "romantic", "scary", "horror"), you MUST provide 3-5 movies of THAT genre immediately.
                           - IGNORE the 'Curated Suggestions' list if those movies do not match the genre the user requested.\s
                           - If the user asks for "Romantic" and the Curated list is Sci-Fi, suggest any famous Romantic movies instead.
                           - Start with "Salut!" and then give the list.
                           - Never ask "What kind of movies do you like?" if the user already mentioned a genre.
                
                           # FORMAT
                           Salut! Here are some picks:
                           - Movie (Year) – Reason.
                           (NO BOLDING, NO TABLES)
            """.formatted(watchedTitles, recommendedTitles, watchlistTitles);
    }
}