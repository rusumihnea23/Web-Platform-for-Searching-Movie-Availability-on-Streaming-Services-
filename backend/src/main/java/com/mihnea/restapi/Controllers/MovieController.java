package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Services.MovieService;
import com.mihnea.restapi.Services.RecommendationService;
import com.mihnea.restapi.Services.TMDBService;
import com.mihnea.restapi.dtos.DetailedMovieDto.MovieDetailDTO;
import com.mihnea.restapi.dtos.GradedMovieDTO;
import com.mihnea.restapi.dtos.MovieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final TMDBService TMDBService;
    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Buna dimineata viata mea!");
    }

    @GetMapping("/{id}")
    public MovieDTO getMovieById(@PathVariable Long id){
        return TMDBService.getMovie(id);
    }

    @GetMapping("/popular")
    public List<MovieDTO> getPopularMovieList(){
        return TMDBService.fetchPopularMovies();
    }

    @GetMapping("/search{query}")
    List<MovieDTO> getMoviesListByQuery(@RequestParam String query){
        return TMDBService.searchMovieList(query);
    }


    @GetMapping("/{id}/details")
    public Mono<MovieDetailDTO> getMovieDetails(@PathVariable Long id) {
        return TMDBService.getDetailedMovie(id);

}
    @GetMapping("/movies")
    public ResponseEntity<List<GradedMovieDTO>> getMovies(
            @RequestParam(defaultValue = "newest") String sortBy) {

        List<GradedMovieDTO> movies = movieService.getAllMovies(sortBy);
        return ResponseEntity.ok(movies);
    }

}
