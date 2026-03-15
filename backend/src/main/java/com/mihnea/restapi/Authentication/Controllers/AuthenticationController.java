package com.mihnea.restapi.Authentication.Controllers;



import com.mihnea.restapi.Authentication.Services.AuthenticationService;
import com.mihnea.restapi.Authentication.dtos.AuthenticationRequest;
import com.mihnea.restapi.Authentication.dtos.AuthenticationResponse;
import com.mihnea.restapi.Authentication.dtos.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request){
    return ResponseEntity.ok(service.register(request));
    }


    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        return ResponseEntity.ok(service.authenticate(request));
    }
}
