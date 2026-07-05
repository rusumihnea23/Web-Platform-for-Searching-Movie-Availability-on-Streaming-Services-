package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.MovieRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.Services.UserMovieLogService;
import com.mihnea.restapi.dtos.MovieDTO;
import com.mihnea.restapi.dtos.Requests.MovieLogRequest;
import com.mihnea.restapi.dtos.UserLogDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/{id}")
    public Boolean isMovieLogged(Authentication authentication,@PathVariable Long id){
        return userMovieLogService.isMovieInLogs(authentication,id);
    }

    @GetMapping("/details")
    public ResponseEntity<List<UserLogDTO>> getDetailedLogs(Authentication authentication) {
        return ResponseEntity.ok(userMovieLogService.getUserLogsWithGrades(authentication));
    }

    @GetMapping("/user/{userId}")
    public List<MovieDTO> getPublicLogs(@PathVariable Long userId) {
        return userMovieLogService.getLogsById(userId);
    }

    @DeleteMapping("/{movieId}/date")
    public ResponseEntity<String> deleteWatchDate(Authentication authentication,
                                                  @PathVariable Long movieId,
                                                  @RequestParam String date) {
        userMovieLogService.deleteWatchDate(authentication, movieId, LocalDate.parse(date));
        return ResponseEntity.ok("Watch date removed.");
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<String> deleteAllLogs(Authentication authentication,
                                                @PathVariable Long movieId) {
        userMovieLogService.deleteAllLogsForMovie(authentication, movieId);
        return ResponseEntity.ok("All logs removed for movie.");
    }
}