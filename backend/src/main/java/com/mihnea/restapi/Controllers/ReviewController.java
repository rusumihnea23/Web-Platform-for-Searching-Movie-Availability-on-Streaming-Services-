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
    public ResponseEntity<List<ReviewDTO>> getMovieReviews(
            Authentication authentication,
            @PathVariable Long movieId,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(required = false) Integer grade) {

        return ResponseEntity.ok(reviewService.getReviewsByMovie(authentication, movieId, sortBy, grade));
    }
    @GetMapping("/user")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(Authentication authentication,@RequestParam(defaultValue = "newest") String sortBy, @RequestParam(required = false) Integer grade) {

        return ResponseEntity.ok(reviewService.getAllUserReviews(authentication, sortBy, grade));

    }

    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<String> deleteReview(Authentication authentication, @PathVariable Long reviewId) {
        reviewService.deleteReview(authentication, reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }
    @PatchMapping("/edit/{reviewId}")
    public ResponseEntity<String> editReview(Authentication authentication, @PathVariable Long reviewId,@RequestBody ReviewRequest request) {
        reviewService.editReview(authentication, reviewId,request);
        return ResponseEntity.ok("Review edited successfully");
    }
    @PostMapping("/{reviewId}/like")
    public ResponseEntity<?> toggleLike(Authentication authentication, @PathVariable Long reviewId) {
        reviewService.toggleLike(authentication, reviewId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/reviews")
    public List<ReviewDTO> getPublicReviews(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(required = false) Integer grade) {

        return reviewService.getReviewsByUserId(userId, sortBy, grade);
    }


}