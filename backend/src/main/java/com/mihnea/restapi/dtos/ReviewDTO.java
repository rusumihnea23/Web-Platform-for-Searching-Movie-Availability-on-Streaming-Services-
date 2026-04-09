package com.mihnea.restapi.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private String content;
    private String userFirstName;
    private String userLastName;
    private String movieTitle;
    private String createdAt;
    private Long movieId;
    private Float personalGrade;
    private boolean isOwner;
}