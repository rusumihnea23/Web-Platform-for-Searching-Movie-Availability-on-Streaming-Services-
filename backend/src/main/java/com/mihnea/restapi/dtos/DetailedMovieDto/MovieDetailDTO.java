package com.mihnea.restapi.dtos.DetailedMovieDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mihnea.restapi.dtos.MovieDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
public class MovieDetailDTO extends MovieDTO {
    private Integer runtime;
    private Long budget;
    private String original_title;
    private String original_language;
    private List<String> genres;
    private List<CastMemberDTO> cast;
    private List<CrewMemberDTO> crew;

    @JsonProperty("genres")
    private void unpackGenres(List<Map<String, Object>> genreEntries) {
        this.genres = genreEntries.stream()
                .map(genre -> (String) genre.get("name"))
                .toList();
    }
}