package com.mihnea.restapi.Services;

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

        ChatRequest request = new ChatRequest("openai/gpt-oss-120b", messages);

        ChatResponse response = restClient.post()
                .body(request)
                .retrieve()
                .body(ChatResponse.class);

        if (response == null || response.choices().isEmpty()) {
            return "Ne pare rău, AI-ul nu a putut genera un răspuns.";
        }

        String aiAnswer = response.choices().get(0).message().content();


        messages.add(new Message("assistant", aiAnswer));

        return aiAnswer;
    }


    public void clearHistory(String username) {
        chatHistory.remove(username);
    }


    private String buildSystemInstruction(Authentication authentication) {
        List<MovieDTO> recommendedDtos = recommendationService.getRecommendations(authentication);
        List<MovieDTO> watchedMoviesDtos = userMovieLogService.getUserLoggedMovies(authentication);
        List<MovieDTO> watchlistMoviesDtos = movieWatchListService.getUserWatchlist(authentication);

        String watchedTitles = String.join(", ", MovieDTO.toTitleList(watchedMoviesDtos));
        String recommendedTitles = String.join(", ", MovieDTO.toTitleList(recommendedDtos));
        String watchlistTitles = String.join(", ", MovieDTO.toTitleList(watchlistMoviesDtos));

        return """
            You are a cinema expert. Your role is to recommend movies based on the user's preferences.
            User Context:
            - Already watched movies: %s
            - Movies that we recommend for him: %s
            - Movies that the user has watchlisted: %s
            
                Rules:
                1. Do NOT recommend movies the user has already seen.
                2. Prioritize movies from our recommendation list if relevant.
                3. Only recommend movies if the user clearly asks for recommendations or describes preferences.
                4. If the user input is vague (e.g. "hello", "hi"), ask a short follow-up question instead.
                5. Keep responses VERY SHORT.
                6. Maximum 3-5 movies.
                7. Each movie = 1 short sentence (max 12 words).
                8. NO tables, NO paragraphs, NO formatting.
                9. Output ONLY a simple list when recommending.
                
                Format (when recommending):
                - Movie Title (Year) – short reason
                
                Format (when unclear):
                Ask ONE short question to clarify preferences.
            """.formatted(watchedTitles, recommendedTitles, watchlistTitles);
    }
}