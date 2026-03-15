package com.mihnea.restapi.dtos.DetailedMovieDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CastMemberDTO {
    private String name;
    private String character;
    @JsonProperty("profile_path")
    private String profilePath;
}