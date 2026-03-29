package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Services.MovieWatchListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/watchlist")
public class WatchListController {


    private final MovieWatchListService userMovieLogService;
    @PatchMapping("/add/{id}")
    public ResponseEntity<String> addToUserWatchlist(Authentication authentication, @PathVariable Long id){
        try {

            userMovieLogService.addMovieToWatchlist(authentication, id);
            return ResponseEntity.ok("Movie watchlisted successfully!");
        }
        catch (RuntimeException r){
            return ResponseEntity.ok("Movie already in watchlist!");
        }

    }
}
