package com.mihnea.restapi.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
public class MovieDTO {
    long id;
    String title;
    String overview;
    String release_date;
    String poster_path;
}
