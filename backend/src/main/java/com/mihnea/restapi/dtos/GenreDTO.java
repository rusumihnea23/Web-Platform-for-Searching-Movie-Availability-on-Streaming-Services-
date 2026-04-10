package com.mihnea.restapi.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenreDTO {
    @Getter
    private Long id;
    private String name;


}