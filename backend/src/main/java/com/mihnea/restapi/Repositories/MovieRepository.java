package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    Optional<Movie> findByApiId(Long tmdbId);
}
