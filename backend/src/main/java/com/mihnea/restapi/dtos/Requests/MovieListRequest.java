package com.mihnea.restapi.dtos.Requests;

import lombok.Data;

@Data
public class MovieListRequest {

    private String name;
    private String description;
    private Long movieId;

}
