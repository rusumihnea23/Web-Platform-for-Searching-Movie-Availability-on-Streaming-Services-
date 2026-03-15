package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRespository extends JpaRepository<User,Long> {
}
