package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRespository extends JpaRepository<User,Long> {
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserById(Long id);
}
