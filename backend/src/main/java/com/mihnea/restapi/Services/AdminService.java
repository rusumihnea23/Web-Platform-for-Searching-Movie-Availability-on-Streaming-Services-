package com.mihnea.restapi.Services;

import com.mihnea.restapi.dtos.Response.ChartDataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class AdminService {
    private final RestTemplate restTemplate;
    // URL of your FastAPI server (ideally injected from application.properties)
    private final String pythonApiUrl = "http://localhost:8000";

    public ChartDataResponse getLogTrends(int days) {
        String url = pythonApiUrl + "/stats/logs?days=" + days;
        // Spring automatically maps the JSON response to your DTO!
        return restTemplate.getForObject(url, ChartDataResponse.class);
    }

    public List<Map<String, Object>> getTopMovies(int limit) {
        String url = pythonApiUrl + "/stats/top-movies?limit=" + limit;
        return restTemplate.getForObject(url, List.class);
    }
    public ChartDataResponse getReviewTrends(int days) {
        String url = pythonApiUrl + "/stats/reviews?days=" + days;
        return restTemplate.getForObject(url, ChartDataResponse.class);
    }
    public Map<String, Integer> getGeneralStats() {
        String url = pythonApiUrl + "/stats/general";

        // Spring's RestTemplate will automatically convert the Python JSON
        // into a Java Map<String, Integer>
        return restTemplate.getForObject(url, Map.class);
    }
}
