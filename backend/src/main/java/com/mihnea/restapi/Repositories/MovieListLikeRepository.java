package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.MovieList;
import com.mihnea.restapi.Models.MovieListLike;
import com.mihnea.restapi.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieListLikeRepository extends JpaRepository<MovieListLike, Long> {
    Optional<MovieListLike> findByUserAndMovieList(User user, MovieList movieList);
    boolean existsByUserIdAndMovieListId(Long userId, Long listId);
}