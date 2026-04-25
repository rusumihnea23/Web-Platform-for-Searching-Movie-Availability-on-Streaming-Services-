package com.mihnea.restapi.Repositories;
import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.dtos.GradedMovieDTO;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    Optional<Movie> findByApiId(Long tmdbId);
    Movie findMovieByApiId(Long apiId);
    @Query("SELECT new com.mihnea.restapi.dtos.GradedMovieDTO(" +
            "m.apiId, m.Title, m.overview, m.releaseDate, m.posterPath, " +
            "CAST(COUNT(l.id) AS double) AS popularity, " +
            "COALESCE(AVG(l.personalGrade), 0.0) AS averageGrade) " +
            "FROM Movie m " +
            "LEFT JOIN m.userMovieLog l " +
            "GROUP BY m.apiId, m.Title, m.overview, m.releaseDate, m.posterPath")
    List<GradedMovieDTO> findAllWithGrades(Sort sort);
}
