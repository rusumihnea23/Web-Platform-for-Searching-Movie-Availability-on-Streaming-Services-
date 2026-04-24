package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.Role;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.Response.ChartDataResponse;
import com.mihnea.restapi.dtos.ReviewDTO;
import com.mihnea.restapi.dtos.UserActivityDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class AdminService {
    private final RestTemplate restTemplate;
    private final UserRespository userRespository;
    private final UserService userService;
    private final String pythonApiUrl = "http://localhost:8000";
    private  final ReviewService reviewService;
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

    public void deleteReview(Authentication authentication,Long reviewId){
        reviewService.deleteReviewAdmin(authentication,reviewId);
    }

    public List<ReviewDTO> getAllReviews(Authentication authentication, String sortBy) {
        return reviewService.getAllReviews(authentication,sortBy);
    }

    public List<UserActivityDTO> searchUsers(String query) {
        String searchTerm = (query == null) ? "" : query;
        return userRespository.findUserActivity(Role.ROLE_USER, searchTerm);
    }
    public void deleteUser(Authentication authentication,Long id){
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole()!= Role.ROLE_ADMIN) {
            throw new RuntimeException("Unauthorized");
        }
        userService.deleteUser(id);
    }
}
