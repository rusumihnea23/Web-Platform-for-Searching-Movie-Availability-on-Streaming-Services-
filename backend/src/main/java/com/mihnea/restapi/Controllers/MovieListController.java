package com.mihnea.restapi.Controllers;


import com.mihnea.restapi.Services.MovieListService;
import com.mihnea.restapi.dtos.LightListMovieDTO;
import com.mihnea.restapi.dtos.ListMovieDTO;
import com.mihnea.restapi.dtos.PublicListDTO;
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
    public List<PublicListDTO> getUserLists(Authentication authentication){
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
    public List<PublicListDTO> getPublicLists(Authentication authentication,@PathVariable Long userId) {
        return movieListService.getPublicUserLists(authentication,userId);
    }

    @GetMapping("lists/{listId}")
    public ListMovieDTO getSingleList(@PathVariable Long listId) {
        return movieListService.getListById(listId);
    }
    @GetMapping("/public")
    public ResponseEntity<List<PublicListDTO>> getPlatformLists(
            Authentication authentication,
            @RequestParam(defaultValue = "popular") String sortBy,
            @RequestParam(required = false) String name) {
        return ResponseEntity.ok(movieListService.getAllPlatformLists(authentication, sortBy, name));
    }

    @PostMapping("/{listId}/like")
    public ResponseEntity<Void> toggleLike(Authentication authentication, @PathVariable Long listId) {
        movieListService.toggleListLike(authentication, listId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/liked")
    public ResponseEntity<List<PublicListDTO>> getLikedLists(Authentication authentication) {
        return ResponseEntity.ok(movieListService.getLikedLists(authentication));
    }
}
