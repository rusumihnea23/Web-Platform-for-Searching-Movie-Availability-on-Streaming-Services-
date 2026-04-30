package com.mihnea.restapi.Services;

import com.mihnea.restapi.Repositories.MovieRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.utils.Mapper;
import com.mihnea.restapi.dtos.MovieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import com.mihnea.restapi.Models.User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@RequiredArgsConstructor
@Service
public class RecommendationService {

    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate;
    private final Mapper mapper = new Mapper(); // Sau injectat ca @Component
    private final UserRespository userRespository;



    public List<MovieDTO> getRecommendations(Authentication authentication) {

        User user=userRespository.getUserByEmail(authentication.getName()).orElseThrow(()->new RuntimeException("User not found"));

        Long userId=user.getId();
        String url = "http://localhost:8000/recommend/" + userId;

        List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);

        if (response == null || response.isEmpty()) return List.of();
        List<Long> internalIds = response.stream()
                .map(m -> Long.valueOf(m.get("id").toString()))
                .collect(Collectors.toList());
        return movieRepository.findAllById(internalIds).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}