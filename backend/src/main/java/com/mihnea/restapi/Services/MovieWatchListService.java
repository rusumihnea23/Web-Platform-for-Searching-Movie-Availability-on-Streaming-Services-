package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.UserRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class MovieWatchListService {


    UserRespository userRespository;
    MovieService movieService;
    public void addMovieToWatchlist(Authentication authentication, Long movieId) throws RuntimeException{

        User user=userRespository.getUserByEmail(authentication.getName()).orElseThrow(()->new RuntimeException("User not found"));

        Movie movie= movieService.getOrCreateMovie(movieId);
        if( user.getWatchlist().contains(movie))
            throw  new RuntimeException("Movie already in watchlist ");
        user.getWatchlist().add(movie);
        userRespository.save(user);
        System.out.println(user.getWatchlist());
    }
}
