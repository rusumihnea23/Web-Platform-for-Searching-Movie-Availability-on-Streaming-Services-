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

    public List<ReviewDTO> getReviewsByMovie(Long movieId) {
        return reviewRepository.findByMovie_ApiId(movieId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ReviewDTO> getAllUserReviews(Authentication authentication){
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reviewRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .toList();
    }

    public void deleteReview(Authentication authentication, Long reviewId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (review.getUser().getId()!= user.getId()) {
            throw new RuntimeException("Unauthorized to delete this review");
        }

        reviewRepository.delete(review);
    }

    private ReviewDTO mapToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .content(review.getContent())
                .userFirstName(review.getUser().getFirstName())
                .userLastName(review.getUser().getLastName())
                .movieTitle(review.getMovie().getTitle())
                .movieId(review.getMovie().getApiId())
                .createdAt(review.getCreatedAt().toString())
                .build();
    }
}