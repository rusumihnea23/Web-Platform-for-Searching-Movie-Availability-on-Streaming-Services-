package com.mihnea.restapi.dtos.DetailedMovieDto.ProviderDao;

import lombok.Data;

import java.util.Map;
@Data
public class WatchProviderDTO {
    private Integer id; // The TMDB Movie ID

    // Map key is the Country Code (e.g., "AE", "RO")
    private Map<String, CountryProvidersDTO> results;
}
