package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Services.TMDBService;
import com.mihnea.restapi.dtos.MovieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final TMDBService TMDBService;
    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Buna dimineata viata mea!");
    }

    @GetMapping("/popular")
    public List<MovieDTO> test(){
        return TMDBService.fetchPopularMovies();
    }
}
