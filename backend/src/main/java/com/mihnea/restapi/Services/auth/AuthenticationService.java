package com.mihnea.restapi.Services.auth;

import com.mihnea.restapi.Models.Role;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.auth.AuthenticationRequest;
import com.mihnea.restapi.dtos.auth.AuthenticationResponse;
import com.mihnea.restapi.dtos.auth.RegisterRequest;
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
        var user= User.builder().firstName(request.getFirstName()).
                lastName(request.getLastName()).
                email(request.getEmail()).
                password(passwordEncoder.
                        encode(request.getPassword()))
                .role(Role.ROLE_USER).build();
        repository.save(user);
        var jwtToken=jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public @Nullable AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
        var user= repository.getUserByEmail(request.getEmail()).orElseThrow(); //todo try and catch the exception
        repository.save(user);
        var jwtToken=jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}
