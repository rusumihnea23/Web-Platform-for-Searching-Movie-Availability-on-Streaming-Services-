package com.mihnea.restapi.Authentication.Services;

import com.mihnea.restapi.Exceptions.BadRequestException;
import com.mihnea.restapi.Exceptions.ResourceAlreadyExistsException;
import com.mihnea.restapi.Models.Role;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.Authentication.dtos.AuthenticationRequest;
import com.mihnea.restapi.Authentication.dtos.AuthenticationResponse;
import com.mihnea.restapi.Authentication.dtos.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRespository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public @Nullable AuthenticationResponse register(RegisterRequest request) {
        if(repository.getUserByEmail(request.getEmail()).isPresent()){
            throw new ResourceAlreadyExistsException("Email already in use");
        }
        if(request.getUsername().length()<3)
            throw  new BadRequestException("Username should be longer than 3 characters");
        if(request.getPassword().length()<6)
            throw  new BadRequestException("Password should be longer than 6 characters");
        if(request.getFirstName().length()<2)
            throw  new BadRequestException("First name should be longer than 2 characters");
        if(request.getLastName().length()<2)
            throw  new BadRequestException("Last name should be longer than 2 characters");
        var user= User.builder().firstName(request.getFirstName()).
                lastName(request.getLastName())
                .username(request.getUsername()).
                email(request.getEmail()).
                password(passwordEncoder.
                        encode(request.getPassword()))
                .role(Role.ROLE_USER).build();
        repository.save(user);
        var jwtToken=jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public @Nullable AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
        var user= repository.getUserByEmail(request.getEmail()).orElseThrow(); //todo try and catch the exception
        repository.save(user);
        var jwtToken=jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
