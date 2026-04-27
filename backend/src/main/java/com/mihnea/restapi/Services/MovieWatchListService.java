package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Models.UserMovieLog;
import com.mihnea.restapi.Repositories.MovieRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.MovieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class MovieWatchListService {

    private final MovieRepository movieRepository;
    private final UserRespository userRespository;
    private final MovieService movieService;


    public void addMovieToWatchlist(Authentication authentication, Long movieId) throws RuntimeException{

        User user=userRespository.getUserByEmail(authentication.getName()).orElseThrow(()->new RuntimeException("User not found"));

        Movie movie= movieService.getOrCreateMovie(movieId);
        if( user.getWatchlist().contains(movie))
            throw  new RuntimeException("Movie already in watchlist ");
        user.getWatchlist().add(movie);
        userRespository.save(user);

    }

    @Transactional
    public void removeFromUserWatchlist(Authentication authentication, Long movieId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Movie movie = movieService.getOrCreateMovie(movieId);
        boolean removed = user.getWatchlist().remove(movie);
        if (!removed) {
            throw new RuntimeException("Movie isn't in watchlist");
        }
        userRespository.save(user);
    }
    public List<MovieDTO> getUserWatchlist(Authentication authentication){
        User user=userRespository.getUserByEmail(authentication.getName()).orElseThrow(()->new RuntimeException("User not found"));
        List<Movie> watchlist=user.getWatchlist();
        return watchlist.stream().map(m->{
            return new MovieDTO(m.getApiId(),m.getTitle(), m.getOverview(),m.getReleaseDate(),m.getPosterPath());
        }).collect(Collectors.toList());
    }

    public Boolean isMovieInWatchlist(Authentication authentication,Long id){
        User user=userRespository.getUserByEmail(authentication.getName()).orElseThrow(()->new RuntimeException("User not found"));
        Movie movie=movieRepository.findMovieByApiId(id);
        return(user.getWatchlist().contains(movie));
    }

    public List<MovieDTO> getWatchlistById(Long userId) {
        User user = userRespository.findById(userId).orElseThrow();
        return user.getWatchlist().stream()
                .map(m -> new MovieDTO(m.getApiId(), m.getTitle(), m.getOverview(), m.getReleaseDate(), m.getPosterPath()))
                .toList();
    }
}
