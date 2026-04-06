package com.mihnea.restapi.Controllers;


import com.mihnea.restapi.Services.MovieListService;
import com.mihnea.restapi.dtos.LightListMovieDTO;
import com.mihnea.restapi.dtos.ListMovieDTO;
import com.mihnea.restapi.dtos.Requests.MovieListRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/list")
public class MovieListController {
    private final MovieListService movieListService;
    @PostMapping
    public ResponseEntity<String> createList(Authentication authentication, @RequestBody MovieListRequest request){
        movieListService.createList(authentication,request);
        return ResponseEntity.ok("List created successfully!");
    }
    @GetMapping("/sparce")
    public List<LightListMovieDTO> getUserListsNames(Authentication authentication){
        return movieListService.getAllLightList(authentication);

    }
    @GetMapping("/detailed")
    public List<ListMovieDTO> getUserLists(Authentication authentication){
        return movieListService.getAllListsFull(authentication);

    }

}
