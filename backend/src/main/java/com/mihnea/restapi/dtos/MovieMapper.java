package com.mihnea.restapi.dtos;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.dtos.DetailedMovieDto.CreditsDTO;
import com.mihnea.restapi.dtos.DetailedMovieDto.MovieDetailDTO;

import java.util.List;
import java.util.Map;

public class MovieMapper {

    public MovieDTO toDTO(Movie movie){
        MovieDTO movieDTO =new MovieDTO();
        movieDTO.setId(movie.getApiId());
        movieDTO.setOverview(movie.getOverview());
        movieDTO.setTitle(movie.getTitle());
        movieDTO.setRelease_date(movie.getReleaseDate());
        movieDTO.setPoster_path(movie.getPosterPath());
        return movieDTO;
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

        return dto;
    }


    public MovieDetailDTO mapToDetailedDTO(MovieDetailDTO details, CreditsDTO credits) {
        if (credits.getCast() != null) {
            details.setCast(credits.getCast().stream()
                    .limit(10)
                    .toList());
        }
        if (credits.getCrew() != null) {
            details.setCrew(credits.getCrew().stream()
                    .filter(member -> List.of("Director", "Screenplay", "Writer", "Story","Producer","Executive Producer","Editor","Director of Photography")
                            .contains(member.getJob()))
                    .toList());
        }

        return details;
    }
}
