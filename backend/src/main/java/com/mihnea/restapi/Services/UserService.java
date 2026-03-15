package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.UserRespository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        validateEmail(user.getEmail());
        userRespository.save(user);
    }

    @Override
    public void updateUser(Long id, User user) {
    User userToUpdate=userRespository.findById(id).orElseThrow(
            ()->new IllegalStateException(String.format("User with id %s dosen't exist",id)));
    validateEmail(user.getEmail());
    userToUpdate.setFirstName(user.getFirstName());
    userToUpdate.setLastName(user.getLastName());
    userToUpdate.setEmail(user.getEmail());
    userToUpdate.setPassword(user.getPassword());

    userRespository.save(userToUpdate);
    }

    @Override
    public void deleteUser(Long id) {
        User userToDelete=userRespository.findById(id).orElseThrow(
                ()->new IllegalStateException(String.format("User with id %s dosen't exist",id)));
        userRespository.delete(userToDelete);

        // sau pot face cu un boolean care verifica daca exista id-ul si apoi userRespository.deleteById(); acelasi lucru doar ca am facut ca sus la update

    }


    private void validateEmail(String email){
        Optional<User> userOptional = userRespository.getUserByEmail(email);
        if(userOptional.isPresent()){
            throw new IllegalStateException(String.format("Email address %s already exists", email));
        }
    }

}
