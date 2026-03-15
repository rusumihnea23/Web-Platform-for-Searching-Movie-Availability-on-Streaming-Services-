package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.UserRespository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService{
    private final UserRespository userRespository;

    public UserService(UserRespository userRespository) {
        this.userRespository = userRespository;
    }

    @Override
    public List<User> getUsers() {
        return userRespository.findAll();
    }

    @Override
    public void createUser(User user) {
        userRespository.save(user);
    }
}
