package com.mihnea.restapi.Services;

import com.mihnea.restapi.dtos.DetailedMovieDto.CreditsDTO;
import com.mihnea.restapi.dtos.DetailedMovieDto.MovieDetailDTO;
import com.mihnea.restapi.dtos.DetailedMovieDto.ProviderDao.WatchProviderDTO;
import com.mihnea.restapi.dtos.MovieDTO;
import com.mihnea.restapi.dtos.Mapper;
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
    private final Mapper mapper;


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

    public List<MovieDTO>searchMovieList(String query) {
        @Nullable Map response = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/search/movie").queryParam("query",query).build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

        // Map each TMDB movie to your MovieDTO
        return results.stream()
                .map(mapper::map)
                .toList();

    }

    public Mono<MovieDetailDTO> getDetailedMovie(Long id) {
        Mono<MovieDetailDTO> detailsMono = webClient.get()
                .uri("/movie/{id}", id)
                .retrieve()
                .bodyToMono(MovieDetailDTO.class);

        Mono<CreditsDTO> creditsMono = webClient.get()
                .uri("/movie/{id}/credits", id)
                .retrieve()
                .bodyToMono(CreditsDTO.class);

        Mono<WatchProviderDTO> providersMono = webClient.get()
                .uri("/movie/{id}/watch/providers", id)
                .retrieve()
                .bodyToMono(WatchProviderDTO.class);

        return Mono.zip(detailsMono, creditsMono,providersMono)
                .map(tuple -> mapper.mapToDetailedDTO(tuple.getT1(), tuple.getT2(),tuple.getT3()));
    }
    }
