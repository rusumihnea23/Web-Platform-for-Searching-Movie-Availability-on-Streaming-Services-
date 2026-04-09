package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.Review;
import com.mihnea.restapi.dtos.ReviewDTO;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT new com.mihnea.restapi.dtos.ReviewDTO(" +
            "r.id, r.content, u.firstName, u.lastName, m.Title, " +
            "CAST(r.createdAt as string), m.apiId, " +
            "l.personalGrade as gradeAlias, " + // Added alias here
            "(CASE WHEN u.id = :currentUserId THEN true ELSE false END), " +
            "(SELECT COUNT(rl) FROM ReviewLike rl WHERE rl.review.id = r.id) as likeCount, " +
            "(CASE WHEN EXISTS (SELECT rl FROM ReviewLike rl WHERE rl.review.id = r.id AND rl.user.id = :currentUserId) THEN true ELSE false END)) " +
            "FROM Review r " +
            "JOIN r.movie m " +
            "JOIN r.user u " +
            "LEFT JOIN UserMovieLog l ON l.user = u AND l.movie = m " +
            "WHERE m.apiId = :movieId " +
            "AND (:grade IS NULL OR l.personalGrade = :grade)")
    List<ReviewDTO> findReviewsWithGrades(@Param("movieId") Long movieId,
                                          @Param("currentUserId") Long currentUserId,
                                          @Param("grade") Integer grade,
                                          Sort sort);

    @Query("SELECT new com.mihnea.restapi.dtos.ReviewDTO(" +
            "r.id, r.content, u.firstName, u.lastName, m.Title, " +
            "CAST(r.createdAt as string), m.apiId, " +
            "l.personalGrade as gradeAlias, " + // Added alias here
            "true, " +
            "(SELECT COUNT(rl) FROM ReviewLike rl WHERE rl.review.id = r.id) as likeCount, " +
            "(CASE WHEN EXISTS (SELECT rl FROM ReviewLike rl WHERE rl.review.id = r.id AND rl.user.id = :userId) THEN true ELSE false END)) " +
            "FROM Review r " +
            "JOIN r.movie m " +
            "JOIN r.user u " +
            "LEFT JOIN UserMovieLog l ON l.user = u AND l.movie = m " +
            "WHERE u.id = :userId " +
            "AND (:grade IS NULL OR l.personalGrade = :grade)")
    List<ReviewDTO> findUserReviewsWithGrades(@Param("userId") Long userId,
                                              @Param("grade") Integer grade,
                                              Sort sort);
}