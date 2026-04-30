package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Services.RecommendationService;
import com.mihnea.restapi.Services.UserService;
import com.mihnea.restapi.dtos.MovieDTO;
import com.mihnea.restapi.dtos.Requests.UpdateNameRequest;
import com.mihnea.restapi.dtos.Requests.UpdateProfilePictureRequest;
import com.mihnea.restapi.dtos.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final RecommendationService recommendationService;
    @GetMapping
    public List<User> getUsers(){
        return userService.getUsers();
    }

    @GetMapping(path="/{id}")
    public UserDTO getUserDetails(@PathVariable Long id){ return userService.getUserDetails(id);}

    @PutMapping(path="/{id}")
    public void updateUser(@PathVariable Long id,@RequestBody User user){
        userService.updateUser(id,user);
    }
    @DeleteMapping(path="/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }

    @GetMapping(value = "/details")
    public UserDTO getUserDetails(Authentication authentication) {
        return userService.getLoggedUserDetails(authentication);
    }
    @GetMapping("/public/{username}")
    public ResponseEntity<UserDTO> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getPublicProfileByUsername(username));
    }
    @PatchMapping(path="/profile/picture")
    public void updateUserPicture(Authentication authentication,@RequestBody UpdateProfilePictureRequest request){
        userService.updateUserProfilePicture(authentication, request.getProfilePicturePath());
    }
    @GetMapping(value = "/profile/picture")
    public String getUserDetailsProfilePicturePath(Authentication authentication) {
        return userService.getUserProfilePicture(authentication);
    }
    @GetMapping(value = "/recommended")
    public List<MovieDTO> getRecommendedMovieList(Authentication authentication) {
        return recommendationService.getRecommendations(authentication);
    }
    @PatchMapping("/profile/lastName")
    public void updateUserLastName(Authentication authentication,@RequestBody UpdateNameRequest request){
        userService.updateUserLasttName(authentication,request.getName());
    }
    @PatchMapping("/profile/firstName")
    public void updateUserFirstName(Authentication authentication,@RequestBody UpdateNameRequest request){
        userService.updateUserFirstName(authentication,request.getName());
    }
    @PatchMapping("/profile/username")
    public void updateUserUsername(Authentication authentication,@RequestBody UpdateNameRequest request){
        userService.updateUserUsername(authentication,request.getName());
    }

  }

