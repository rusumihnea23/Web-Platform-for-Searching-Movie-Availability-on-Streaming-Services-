package com.mihnea.restapi.dtos;

import lombok.Getter;
import lombok.Setter;

public class MovieDTO {
    @Setter
    @Getter
    long id;
    @Setter
    @Getter
    String title;
    @Setter
    @Getter
    String overview;
    @Setter
    @Getter
    String release_date;
    @Setter
    @Getter
    String poster_path;
}
