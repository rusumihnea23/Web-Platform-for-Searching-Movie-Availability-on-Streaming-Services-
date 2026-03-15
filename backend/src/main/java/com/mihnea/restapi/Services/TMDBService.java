package com.mihnea.restapi.Services;

import com.mihnea.restapi.dtos.MovieDTO;
import com.mihnea.restapi.dtos.MovieMapper;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class TMDBService {
    private final WebClient webClient;
    private final MovieMapper mapper;


    public List<MovieDTO> fetchPopularMovies() {
        @Nullable Map response = webClient.get()
                .uri("/movie/popular")
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

        // Map each TMDB movie to your MovieDTO
        return results.stream()
                .map(mapper::map)
                .toList();

}
    public MovieDTO getMovie(Long id) {
        @Nullable Map response = webClient.get()
                .uri("/movie/{id}", id)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        return mapper.map(response);
    }


}
