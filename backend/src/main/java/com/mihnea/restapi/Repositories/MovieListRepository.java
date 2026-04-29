package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.MovieList;
import com.mihnea.restapi.dtos.PublicListDTO;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieListRepository extends JpaRepository<MovieList, Long> {

    Optional<MovieList> findByOwnerIdAndId(Long userId, Long id);
    List<MovieList> findByOwnerId(Long id);
    Optional<MovieList> findById(Long id);

    @Query("SELECT ml FROM MovieList ml WHERE (:name IS NULL OR LOWER(ml.name) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%')))")
    List<MovieList> findAllByNameContaining(@Param("name") String name, Sort sort);
}