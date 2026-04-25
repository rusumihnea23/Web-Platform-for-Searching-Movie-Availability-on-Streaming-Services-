package com.mihnea.restapi.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class GradedMovieDTO extends MovieDTO {
    private double popularity;
    private double voteAverage;

    public GradedMovieDTO() {
        super();
    }

    public GradedMovieDTO(Long id, String title, String overview, String release_date,
                          String poster_path, double popularity, double voteAverage) {
        super(id, title, overview, release_date, poster_path);
        this.popularity = popularity;
        this.voteAverage = voteAverage;
    }
}