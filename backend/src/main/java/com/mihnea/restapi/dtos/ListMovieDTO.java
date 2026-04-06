package com.mihnea.restapi.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ListMovieDTO {
    private Long id;
    private String name;
    private String description;
    private List<MovieDTO> movies;
}
