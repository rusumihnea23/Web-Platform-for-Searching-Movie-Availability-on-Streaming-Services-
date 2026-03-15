package com.mihnea.restapi.dtos.DetailedMovieDto;

import lombok.Data;

import java.util.List;

@Data
public class CreditsDTO {
    private List<CastMemberDTO> cast;
    private List<CrewMemberDTO> crew;
}