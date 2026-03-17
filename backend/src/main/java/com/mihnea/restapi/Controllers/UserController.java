package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Services.UserService;
import com.mihnea.restapi.dtos.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

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
    public UserDTO currentUserName(Authentication authentication) {
        return userService.getLoggedUserDetails(authentication);
    }
  }

