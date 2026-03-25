package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Repositories.MovieRepository;
import com.mihnea.restapi.dtos.MovieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;
    private final TMDBService TMDBService;

    public Movie getOrCreateMovie(Long tmdbId) {

        return movieRepository.findByApiId(tmdbId)
                .orElseGet(() -> {
                    MovieDTO dto = TMDBService.getMovie(tmdbId);
                    Movie newMovie = Movie.builder()
                            .apiId(dto.getId())
                            .Title(dto.getTitle())
                            .posterPath(dto.getPoster_path())
                            .overview(dto.getOverview())
                            .releaseDate(dto.getRelease_date())
                            // .overview(dto.getOverview()) // map other fields as needed
                            .build();
                    return movieRepository.save(newMovie);
                });
    }
}
