package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.*;
import com.mihnea.restapi.Repositories.ReviewLikeRepository;
import com.mihnea.restapi.Repositories.ReviewRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.Requests.ReviewRequest;
import com.mihnea.restapi.dtos.ReviewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRespository userRespository;
    private final MovieService movieService;
    private final ReviewLikeRepository reviewLikeRepository;
    private Long getCurrentUserId(Authentication authentication) {
        if (authentication == null) return -1L;
        return userRespository.getUserByEmail(authentication.getName())
                .map(User::getId).orElse(-1L);
    }
    public List<ReviewDTO> getReviewsByUserId(Long userId, String sortBy, Integer grade) {
        Sort sort = getSortOrder(sortBy);
        Integer filterGrade = (grade != null && grade > 0) ? grade : null;
        return reviewRepository.findUserReviewsWithGrades(userId, grade, sort);
    }
    public List<ReviewDTO> getReviewsByMovie(Authentication auth, Long movieId, String sortBy, Integer grade) {
        Sort sort = getSortOrder(sortBy);
        Long currentUserId = getCurrentUserId(auth);

        // If grade is 0 or null, pass null to the repository to trigger the "IS NULL" check
        Integer filterGrade = (grade != null && grade > 0) ? grade : null;

        return reviewRepository.findReviewsWithGrades(movieId, currentUserId, filterGrade, sort);
    }

    public List<ReviewDTO> getAllUserReviews(Authentication authentication, String sortBy, Integer grade) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sort sort = getSortOrder(sortBy);

        // Treat 0 or null as "no filter"
        Integer filterGrade = (grade != null && grade > 0) ? grade : null;

        return reviewRepository.findUserReviewsWithGrades(user.getId(), filterGrade, sort);
    }

    public List<ReviewDTO> getAllReviews(Authentication authentication, String sortBy) {
        User currentUser = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Sort sort = getSortOrder(sortBy);

       return reviewRepository.findAllReviewsForAdmin( sort);
    }

    private Sort getSortOrder(String sortBy) {
        switch (sortBy.toLowerCase()) {
            case "popular":
                return Sort.by(Sort.Direction.DESC, "likeCount");
            case "least-liked":
                return Sort.by(Sort.Direction.ASC, "likeCount");
            case "highest-grade":
                // Target the alias defined in the @Query
                return Sort.by(Sort.Direction.DESC, "gradeAlias");
            case "lowest-grade":
                return Sort.by(Sort.Direction.ASC, "gradeAlias");
            case "oldest":
                return Sort.by(Sort.Direction.ASC, "createdAt");
            case "newest":
            default:
                return Sort.by(Sort.Direction.DESC, "createdAt");
        }
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
    public void deleteReviewAdmin(Authentication authentication, Long reviewId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (user.getRole()!= Role.ROLE_ADMIN) {
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
    public void toggleLike(Authentication authentication, Long reviewId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));


        Optional<ReviewLike> existingLike = reviewLikeRepository.findByUserAndReview(user, review);

        if (existingLike.isPresent()) {
            reviewLikeRepository.delete(existingLike.get());
        } else {
            reviewLikeRepository.save(new ReviewLike(user, review));
        }
    }

}