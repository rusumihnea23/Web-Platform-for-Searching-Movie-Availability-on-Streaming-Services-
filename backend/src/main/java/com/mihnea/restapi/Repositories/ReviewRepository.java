package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find all reviews for a specific movie to show on the movie page
    List<Review> findByMovieId(Long movieId);

    // Find all reviews by a specific user for their profile page
    List<Review> findByUserId(Long userId);
    List<Review> findByMovie_ApiId(Long apiId);
    // Check if a user has already reviewed a specific movie
    boolean existsByUserIdAndMovieId(Long userId, Long movieId);
}