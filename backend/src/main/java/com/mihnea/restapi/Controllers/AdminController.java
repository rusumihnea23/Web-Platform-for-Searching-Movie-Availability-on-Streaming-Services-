package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Services.AdminService;
import com.mihnea.restapi.dtos.Response.ChartDataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')") // Your standard Spring Security
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    @GetMapping("/general")
    public ResponseEntity<Map<String, Integer>> getGeneralStats() {
        return ResponseEntity.ok(adminService.getGeneralStats());
    }

    // 2. Log Trends Chart
    @GetMapping("/logs-chart")
    public ResponseEntity<ChartDataResponse> getLogsChart(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(adminService.getLogTrends(days));
    }

    // 3. Review Trends Chart (Fixed this one!)
    @GetMapping("/reviews-chart")
    public ResponseEntity<ChartDataResponse> getReviewsChart(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(adminService.getReviewTrends(days)); // Changed from getTopMovies
    }

    // 4. Top Performing Movies Table (Added this one!)
    @GetMapping("/top-movies")
    public ResponseEntity<List<Map<String, Object>>> getTopMovies(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(adminService.getTopMovies(limit));

}}
