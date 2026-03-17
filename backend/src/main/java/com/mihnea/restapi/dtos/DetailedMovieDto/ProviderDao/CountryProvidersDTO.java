package com.mihnea.restapi.dtos.DetailedMovieDto.ProviderDao;

import lombok.Data;
import java.util.List;

@Data
public class CountryProvidersDTO {
    private String link; // TMDB watch page link
    private List<ProviderDetailDTO> flatrate; // Streaming (Netflix, Disney+)
    private List<ProviderDetailDTO> rent;     // Rental (Apple TV, Google Play)
    private List<ProviderDetailDTO> buy;      // Purchase
}