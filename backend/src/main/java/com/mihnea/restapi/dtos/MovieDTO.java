package com.mihnea.restapi.dtos;

import lombok.Data;


import java.util.List;

@Data

public class MovieDTO {
    long id;
    String title;

    public MovieDTO() {
    }

    String overview;
    String release_date;
    private List<GenreDTO> genres;
    public MovieDTO(Long id,String title, String overview, String release_date, String poster_path) {
        this.id=id;
        this.title = title;
        this.overview = overview;
        this.release_date = release_date;
        this.poster_path = poster_path;
    }

    String poster_path;

    public static List<String> toTitleList(List<MovieDTO> movies) {
        return movies == null ? List.of() : movies.stream()
                .map(MovieDTO::getTitle)
                .toList();
    }
}
