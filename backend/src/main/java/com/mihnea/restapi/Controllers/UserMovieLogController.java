package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.MovieRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.Services.UserMovieLogService;
import com.mihnea.restapi.dtos.MovieDTO;
import com.mihnea.restapi.dtos.Requests.MovieLogRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/log")
public class UserMovieLogController {
    private final UserMovieLogService userMovieLogService;
    private final UserRespository userRespository;
    private final MovieRepository movieRepository;
    @PostMapping("/add")
    public ResponseEntity<String> LogMovie(Authentication authentication,@RequestBody MovieLogRequest request) {
        userMovieLogService.logMovie(authentication,request);
        return ResponseEntity.ok("Movie logged successfully!");
    }

    @GetMapping("/movies")
    public List<MovieDTO> getUserMovies(Authentication authentication){
        User user=userRespository.getUserByEmail(authentication.getName()).orElseThrow(
                ()->new IllegalStateException(String.format("User with name %s dosen't exist",authentication.getName())));

        List<MovieDTO> movies=userMovieLogService.getUserLoggedMovies(user.getId());
         return  movies;
    }

    @PatchMapping("/watchlist/add/{id}")
    public ResponseEntity<String> addToUserWatchlist(Authentication authentication,@PathVariable Long id){
        try {
            userMovieLogService.addMovieToWatchlist(authentication, id);
            return ResponseEntity.ok("Movie watchlisted successfully!");
        }
        catch (RuntimeException r){
            return ResponseEntity.ok("Movie already in watchlist!");
        }

    }
}
