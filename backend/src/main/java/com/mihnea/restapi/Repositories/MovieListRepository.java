package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.MovieList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieListRepository extends JpaRepository<MovieList, Long> {


    Optional<MovieList> findByOwnerIdAndId(Long userId, Long id);




    List<MovieList> findByOwnerId(Long id);

    Optional<MovieList> findById(Long id);
}
