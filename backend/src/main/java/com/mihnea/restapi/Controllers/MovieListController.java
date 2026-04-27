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
    @GetMapping("/sparse")
    public List<LightListMovieDTO> getUserListsNames(Authentication authentication){
        return movieListService.getAllLightList(authentication);

    }
    @GetMapping("/detailed")
    public List<ListMovieDTO> getUserLists(Authentication authentication){
        return movieListService.getAllListsFull(authentication);

    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateList(Authentication authentication, @PathVariable Long id, @RequestBody MovieListRequest request) {
        movieListService.updateListDetails(authentication, id, request);
        return ResponseEntity.ok("List updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteList(Authentication auth, @PathVariable Long id) {
        movieListService.deleteList(auth, id);
        return ResponseEntity.ok("List deleted successfully");
    }
    @GetMapping("/{id}")
    public List<ListMovieDTO> getSingleList(Authentication authentication, @PathVariable Long id) {
        return movieListService.getList(authentication, id);
    }

    @PostMapping("/{listId}/movies/{movieId}")
    public ResponseEntity<String> addMovieToList(Authentication authentication, @PathVariable Long listId, @PathVariable Long movieId) {
        movieListService.addMovieToList(authentication, listId, movieId);
        return ResponseEntity.ok("Movie added to list successfully");
    }


    @DeleteMapping("/{listId}/movies/{movieId}")
    public ResponseEntity<String> removeMovieFromList(Authentication authentication, @PathVariable Long listId, @PathVariable Long movieId) {
        movieListService.removeMovieFromList(authentication, listId, movieId);
        return ResponseEntity.ok("Movie removed from list successfully");
    }
    @GetMapping("/user/{userId}")
    public List<ListMovieDTO> getPublicLists(@PathVariable Long userId) {
        return movieListService.getListsByUserId(userId);
    }

    // This one stays the same for everyone (viewing a single list by ID)
    @GetMapping("lists/{listId}")
    public ListMovieDTO getSingleList(@PathVariable Long listId) {
        return movieListService.getListById(listId);
    }

}
