package com.mihnea.restapi.dtos.Requests;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieLogRequest {

    private Long userId;
    private Long movieId;
    private float personalGrade;
    private LocalDate watchDate;
}
