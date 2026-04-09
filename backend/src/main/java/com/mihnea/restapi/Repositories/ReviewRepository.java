package com.mihnea.restapi.Repositories;
import com.mihnea.restapi.Models.Review;
import com.mihnea.restapi.dtos.ReviewDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
    public interface ReviewRepository extends JpaRepository<Review, Long> {

        @Query("SELECT new com.mihnea.restapi.dtos.ReviewDTO(" +
                "r.id, " +
                "r.content, " +
                "u.firstName, " +
                "u.lastName, " +
                "m.Title, " +
                "CAST(r.createdAt as string), " +
                "m.apiId, " +
                "l.personalGrade, " +
                "(CASE WHEN u.id = :currentUserId THEN true ELSE false END)) " +
                "FROM Review r " +
                "JOIN r.movie m " +
                "JOIN r.user u " +
                "LEFT JOIN UserMovieLog l ON l.user = u AND l.movie = m " +
                "WHERE m.apiId = :movieId")
        List<ReviewDTO> findReviewsWithGrades(@Param("movieId") Long movieId, @Param("currentUserId") Long currentUserId);

        @Query("SELECT new com.mihnea.restapi.dtos.ReviewDTO(" +
                "r.id, r.content, u.firstName, u.lastName, m.Title, " +
                "CAST(r.createdAt as string), m.apiId, l.personalGrade, true) " +
                "FROM Review r " +
                "JOIN r.movie m " +
                "JOIN r.user u " +
                "LEFT JOIN UserMovieLog l ON l.user = u AND l.movie = m " +
                "WHERE u.id = :userId")
        List<ReviewDTO> findUserReviewsWithGrades(@Param("userId") Long userId);
}