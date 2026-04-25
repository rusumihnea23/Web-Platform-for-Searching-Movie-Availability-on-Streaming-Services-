package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.Genre;
import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Repositories.GenreRepository;
import com.mihnea.restapi.Repositories.MovieRepository;
import com.mihnea.restapi.dtos.GenreDTO;
import com.mihnea.restapi.dtos.GradedMovieDTO;
import com.mihnea.restapi.dtos.MovieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort; // ---> ADD THIS IMPORT <---
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

    public List<GradedMovieDTO> getAllMovies(String sortBy) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            sortBy = "newest";
        }

        Sort sortOrder = getSortOrder(sortBy);
        return movieRepository.findAllWithGrades(sortOrder);
    }

    private Sort getSortOrder(String sortBy) {
        switch (sortBy.toLowerCase()) {
            case "popular":
                // Use JpaSort.unsafe for query aliases that don't exist in the entity
                return JpaSort.unsafe(Sort.Direction.DESC, "popularity");
            case "least-liked":
                return JpaSort.unsafe(Sort.Direction.ASC, "popularity");
            case "highest-grade":
                return JpaSort.unsafe(Sort.Direction.DESC, "averageGrade");
            case "lowest-grade":
                return JpaSort.unsafe(Sort.Direction.ASC, "averageGrade");
            case "oldest":
                // Standard Sort.by works fine here because releaseDate IS in the Movie entity
                return Sort.by(Sort.Direction.ASC, "releaseDate");
            case "newest":
            default:
                return Sort.by(Sort.Direction.DESC, "releaseDate");
        }
    }
}