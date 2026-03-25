package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@RequiredArgsConstructor
@Service
public class UserService implements IUserService{
    private final UserRespository userRespository;

    @Override
    public List<User> getUsers() {
        return userRespository.findAll();
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

    }

    public UserDTO getUserDetails(Long id){
        User userToReturn=userRespository.findById(id).orElseThrow(
                ()->new IllegalStateException(String.format("User with id %s dosen't exist",id)));
        UserDTO dtoToReturn=new UserDTO();
        dtoToReturn.setId(userToReturn.getId());
        dtoToReturn.setEmail(userToReturn.getEmail());
        dtoToReturn.setFirstName(userToReturn.getFirstName());
        dtoToReturn.setLastName(userToReturn.getLastName());
        return dtoToReturn;
    }

    public UserDTO getLoggedUserDetails(Authentication authentication){
        User userToReturn=userRespository.getUserByEmail(authentication.getName()).orElseThrow(
                ()->new IllegalStateException(String.format("User with name %s dosen't exist",authentication.getName())));
        UserDTO dtoToReturn=new UserDTO();
        dtoToReturn.setId(userToReturn.getId());
        dtoToReturn.setEmail(userToReturn.getEmail());
        dtoToReturn.setFirstName(userToReturn.getFirstName());
        dtoToReturn.setLastName(userToReturn.getLastName());
        dtoToReturn.setProfilePicturePath(userToReturn.getProfilePicturePath());
        return dtoToReturn;
    }

    private void validateEmail(String email){
        Optional<User> userOptional = userRespository.getUserByEmail(email);
        if(userOptional.isPresent()){
            throw new IllegalStateException(String.format("Email address %s already exists", email));
        }
    }

    public void updateUserProfilePicture(Authentication authentication,String profilePicturePath) {
        User userToUpdate=userRespository.getUserByEmail(authentication.getName()).orElseThrow(
                ()->new IllegalStateException(String.format("User with name %s dosen't exist",authentication.getName())));
       userToUpdate.setProfilePicturePath(profilePicturePath);
        userRespository.save(userToUpdate);
    }

    public String getUserProfilePicture(Authentication authentication){
        User userToReturn=userRespository.getUserByEmail(authentication.getName()).orElseThrow(
                ()->new IllegalStateException(String.format("User with name %s dosen't exist",authentication.getName())));

        return userToReturn.getProfilePicturePath();
    }



    public void updateUserFirstName(Authentication authentication,String firstName) {
        User userToUpdate=userRespository.getUserByEmail(authentication.getName()).orElseThrow(
                ()->new IllegalStateException(String.format("User with name %s dosen't exist",authentication.getName())));
        userToUpdate.setFirstName(firstName);
        userRespository.save(userToUpdate);
    }
    public void updateUserLasttName(Authentication authentication,String lastName) {
        User userToUpdate=userRespository.getUserByEmail(authentication.getName()).orElseThrow(
                ()->new IllegalStateException(String.format("User with name %s dosen't exist",authentication.getName())));
        userToUpdate.setLastName(lastName);
        userRespository.save(userToUpdate);
    }
}
