package com.mihnea.restapi.dtos;

import com.mihnea.restapi.Models.Movie;

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

}
