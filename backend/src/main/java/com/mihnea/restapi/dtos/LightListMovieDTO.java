package com.mihnea.restapi.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LightListMovieDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
}
