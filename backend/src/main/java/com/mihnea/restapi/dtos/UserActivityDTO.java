package com.mihnea.restapi.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserActivityDTO {
    private Long id;
    private String email;
    private String profile_picture_path;
    private String firstName;
    private String lastName;
    private String username;
    private Long totalLogs;
    private Long totalReviews;
}