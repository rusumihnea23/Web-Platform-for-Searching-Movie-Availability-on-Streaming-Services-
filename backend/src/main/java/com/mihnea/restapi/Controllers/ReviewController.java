package com.mihnea.restapi.Controllers;


import com.mihnea.restapi.Services.ReviewService;
import com.mihnea.restapi.dtos.Requests.ReviewRequest;
import com.mihnea.restapi.dtos.ReviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<String> addReview(Authentication authentication, @RequestBody ReviewRequest request) {
        reviewService.addReview(authentication, request);
        return ResponseEntity.ok("Review added successfully");
    }


    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(reviewService.getReviewsByMovie(movieId));
    }
    @GetMapping("/user")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(Authentication authentication) {
        return ResponseEntity.ok(reviewService.getAllUserReviews(authentication));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<String> deleteReview(Authentication authentication, @PathVariable Long reviewId) {
        reviewService.deleteReview(authentication, reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }

}