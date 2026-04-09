package com.mihnea.restapi.dtos.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private Long movieId;
    private String movieTitle;
    private String userFirstName;
    private String userLastName;
    private Float personalGrade; // The magic field
    private boolean isOwner;     // Helpful for showing/hiding delete buttons
}