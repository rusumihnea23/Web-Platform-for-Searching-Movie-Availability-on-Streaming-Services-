package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Models.Review;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.ReviewRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.Requests.ReviewRequest;
import com.mihnea.restapi.dtos.ReviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRespository userRespository;
    private final MovieService movieService;

    private Long getCurrentUserId(Authentication authentication) {
        if (authentication == null) return -1L;
        return userRespository.getUserByEmail(authentication.getName())
                .map(User::getId).orElse(-1L);
    }

    public List<ReviewDTO> getReviewsByMovie(Authentication authentication, Long movieId) {
        return reviewRepository.findReviewsWithGrades(movieId, getCurrentUserId(authentication));
    }

    public List<ReviewDTO> getAllUserReviews(Authentication authentication) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reviewRepository.findUserReviewsWithGrades(user.getId());
    }

    public void addReview(Authentication authentication, ReviewRequest request) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Movie movie = movieService.getOrCreateMovie(request.getMovieId());

        Review review = Review.builder()
                .content(request.getContent())
                .user(user)
                .movie(movie)
                .build();
        reviewRepository.save(review);
    }

    public void deleteReview(Authentication authentication, Long reviewId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (review.getUser().getId()!=(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        reviewRepository.delete(review);
    }
    public void editReview(Authentication authentication, Long reviewId,ReviewRequest request) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setContent(request.getContent());
        if (review.getUser().getId()!=(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        reviewRepository.save(review);
    }

}