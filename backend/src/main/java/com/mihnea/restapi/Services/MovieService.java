package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.Genre;
import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Repositories.GenreRepository;
import com.mihnea.restapi.Repositories.MovieRepository;
import com.mihnea.restapi.dtos.GenreDTO;
import com.mihnea.restapi.dtos.MovieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;
    private final TMDBService TMDBService;
    private final GenreRepository genreRepository;
    public Movie getOrCreateMovie(Long tmdbId) {
        return movieRepository.findByApiId(tmdbId)
                .orElseGet(() -> {
                    MovieDTO dto = TMDBService.getMovie(tmdbId);

                    // 1. Check what TMDB sent
                    List<Long> genreIds = dto.getGenres().stream()
                            .map(GenreDTO::getId)
                            .toList();
                    System.out.println("DEBUG: IDs from TMDB -> " + genreIds);

                    // 2. Check what the DB finds
                    List<Genre> existingGenres = genreRepository.findAllById(genreIds);
                    System.out.println("DEBUG: Genres found in DB -> " + existingGenres.size());

                    Movie newMovie = Movie.builder()
                            .apiId(dto.getId())
                            .Title(dto.getTitle())
                            .posterPath(dto.getPoster_path())
                            .overview(dto.getOverview())
                            .releaseDate(dto.getRelease_date())
                            .genres(new HashSet<>(existingGenres)) // This MUST NOT be empty
                            .build();

                    Movie savedMovie = movieRepository.save(newMovie);
                    System.out.println("DEBUG: Movie saved with genres: " + savedMovie.getGenres().size());

                    return savedMovie;
                });
    }

}
