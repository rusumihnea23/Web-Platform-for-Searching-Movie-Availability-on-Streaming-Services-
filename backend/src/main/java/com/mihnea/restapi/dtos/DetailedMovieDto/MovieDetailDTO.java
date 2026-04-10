package com.mihnea.restapi.dtos.DetailedMovieDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mihnea.restapi.dtos.DetailedMovieDto.ProviderDao.WatchProviderDTO;
import com.mihnea.restapi.dtos.GenreDTO;
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

    // Change this from List<String> to List<GenreDTO>
    private List<GenreDTO> genres;

    private List<CastMemberDTO> cast;
    private List<CrewMemberDTO> crew;
    private WatchProviderDTO watchProviderDTO;

    @JsonProperty("genres")
    private void unpackGenres(List<Map<String, Object>> genreEntries) {
        this.genres = genreEntries.stream()
                .map(genre -> new GenreDTO(
                        ((Number) genre.get("id")).longValue(),
                        (String) genre.get("name")
                ))
                .toList();
    }
}