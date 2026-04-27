package com.mihnea.restapi.dtos;

import com.mihnea.restapi.Models.Role;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String profilePicturePath;
    private Role role;
    private String username;
}
