package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers(){
        return userService.getUsers();
    }

    @PostMapping
    public void createUser(@RequestBody User user){
        userService.createUser(user);
    }

    @PutMapping(path="/{id}")
    public void updateUser(@PathVariable Long id,@RequestBody User user){
        userService.updateUser(id,user);
    }
    @DeleteMapping(path="/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }
}
