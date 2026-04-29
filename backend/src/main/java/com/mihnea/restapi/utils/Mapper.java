package com.mihnea.restapi.dtos;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Models.Review;
import com.mihnea.restapi.dtos.DetailedMovieDto.CreditsDTO;
import com.mihnea.restapi.dtos.DetailedMovieDto.MovieDetailDTO;
import com.mihnea.restapi.dtos.DetailedMovieDto.ProviderDao.WatchProviderDTO;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class Mapper {

    private static final Set<String> IMPORTANT_JOBS = Set.of(
            "Director", "Screenplay", "Writer", "Story",
            "Producer", "Executive Producer", "Editor", "Director of Photography"
    );
    public MovieDTO toDTO(Movie movie) {
        MovieDTO dto = new MovieDTO();
        dto.setId(movie.getApiId());
        dto.setTitle(movie.getTitle());
        dto.setOverview(movie.getOverview());
        dto.setPoster_path(movie.getPosterPath());
        dto.setRelease_date(movie.getReleaseDate());

        // Convert Entity Set to DTO List
        if (movie.getGenres() != null) {
            dto.setGenres(movie.getGenres().stream()
                    .map(g -> new GenreDTO(g.getId(), g.getName()))
                    .toList());
        }
        return dto;
    }

    public Movie toMovie(MovieDTO movieDTO){
        Movie movie=new Movie();
        movie.setOverview(movieDTO.getOverview());
        movie.setPosterPath(movieDTO.getPoster_path());
        movie.setTitle(movieDTO.getTitle());
        movie.setApiId(movieDTO.getId());
        movie.setReleaseDate(movieDTO.getRelease_date());
        return movie;
    }

    public MovieDTO map(Map<String, Object> tmdbMovie) {
        MovieDTO dto = new MovieDTO();

        // Ce e in raspunsul de la TMDB api modat pe dtoul nostru
        dto.setId(((Number) tmdbMovie.get("id")).longValue());
        dto.setTitle((String) tmdbMovie.get("title"));
        dto.setOverview((String) tmdbMovie.get("overview"));
        dto.setRelease_date((String) tmdbMovie.get("release_date"));
        String posterPath = (String) tmdbMovie.get("poster_path");
        dto.setPoster_path(posterPath);
        if (tmdbMovie.containsKey("genres")) {
            List<Map<String, Object>> genresList = (List<Map<String, Object>>) tmdbMovie.get("genres");
            List<GenreDTO> genreDTOs = genresList.stream()
                    .map(g -> new GenreDTO(
                            ((Number) g.get("id")).longValue(),
                            (String) g.get("name")
                    ))
                    .toList();
            dto.setGenres(genreDTOs);
        }
        return dto;
    }

    public MovieDetailDTO mapToDetailedDTO(MovieDetailDTO details, CreditsDTO credits, WatchProviderDTO provider) {
        if (credits.getCast() != null) {
            details.setCast(credits.getCast().stream()
                    .limit(10)
                    .toList());
        }
        if (credits.getCrew() != null) {
            details.setCrew(credits.getCrew().stream()
                    .filter(member -> IMPORTANT_JOBS.contains(member.getJob()))
                    .toList());
        }
        details.setWatchProviderDTO(provider);

        return details;
    }

}
