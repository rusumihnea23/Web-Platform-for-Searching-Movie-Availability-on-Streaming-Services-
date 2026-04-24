package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.Role;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.dtos.UserActivityDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRespository extends JpaRepository<User,Long> {
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserById(Long id);



    @Query("SELECT new com.mihnea.restapi.dtos.UserActivityDTO(" +
            "u.id, u.email, u.profilePicturePath, u.firstName, u.lastName, " +
            "COUNT(DISTINCT m.id), " +
            "COUNT(DISTINCT r.id)) " +
            "FROM User u " +
            "LEFT JOIN u.userMovieLog m " +
            "LEFT JOIN u.reviews r " +
            "WHERE u.role = :role " +
            "AND (lower(u.firstName) LIKE lower(concat('%', :searchTerm, '%')) " +
            "OR lower(u.lastName) LIKE lower(concat('%', :searchTerm, '%')) " +
            "OR lower(u.email) LIKE lower(concat('%', :searchTerm, '%'))) " + // Added email here
            "GROUP BY u.id, u.email, u.profilePicturePath, u.firstName, u.lastName")
    List<UserActivityDTO> findUserActivity(
            @Param("role") Role role,
            @Param("searchTerm") String searchTerm
    );
}