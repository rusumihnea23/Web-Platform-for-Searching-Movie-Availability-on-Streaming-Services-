package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.UserMovieLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserMovieLogRepository extends JpaRepository<UserMovieLog,Long> {
    Optional<UserMovieLog> findByUserIdAndMovieId(Long userId, Long movieId);
    List<UserMovieLog> findByUserId(Long userId);
    List<UserMovieLog> findByMovieId(Long movieId);

}
