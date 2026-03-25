package com.mihnea.restapi.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
@Data

public class MovieDTO {
    long id;
    String title;

    public MovieDTO() {
    }

    String overview;
    String release_date;

    public MovieDTO(Long id,String title, String overview, String release_date, String poster_path) {
        this.id=id;
        this.title = title;
        this.overview = overview;
        this.release_date = release_date;
        this.poster_path = poster_path;
    }

    String poster_path;
}
