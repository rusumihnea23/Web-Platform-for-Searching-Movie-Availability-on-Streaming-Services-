package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.Review;
import com.mihnea.restapi.Models.ReviewLike;
import com.mihnea.restapi.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {
    Optional<ReviewLike> findByUserAndReview(User user, Review review);
    long countByReviewId(Long reviewId);
}