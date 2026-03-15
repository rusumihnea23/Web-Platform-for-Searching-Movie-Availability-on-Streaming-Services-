package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.User;

import java.util.List;

public interface IUserService {
    List<User> getUsers();
    void createUser(User user);
}
