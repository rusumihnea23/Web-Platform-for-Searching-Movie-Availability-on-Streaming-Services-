package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Services.MovieWatchListService;
import com.mihnea.restapi.dtos.MovieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/watchlist")
public class WatchListController {


    private final MovieWatchListService movieWatchListService;
    @PatchMapping("/add/{id}")
    public ResponseEntity<String> addToUserWatchlist(Authentication authentication, @PathVariable Long id){
        try {

            movieWatchListService.addMovieToWatchlist(authentication, id);
            return ResponseEntity.ok("Movie watchlisted successfully!");
        }
        catch (RuntimeException r){
            return ResponseEntity.ok("Movie already in watchlist!");
        }


    }
    @GetMapping("")
    public List<MovieDTO> getUserWatchlist(Authentication authentication){

        return movieWatchListService.getUserWatchlist(authentication);
    }

    @GetMapping("/{id}")
    public Boolean isMovieInUserWatchList(Authentication authentication,@PathVariable Long id){
        return movieWatchListService.isMovieInWatchlist(authentication,id);
    }

}
