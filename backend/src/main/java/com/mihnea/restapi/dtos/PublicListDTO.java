package com.mihnea.restapi.dtos;

import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PublicListDTO {
    private Long id;
    private String name;
    private String description;
    private String ownerUsername;
    private long likeCount;
    private boolean likedByMe;
    private List<MovieDTO> movies;
}