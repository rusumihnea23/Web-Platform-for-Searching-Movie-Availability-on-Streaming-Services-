package com.mihnea.restapi.Controllers.auth;



import com.mihnea.restapi.Services.auth.AuthenticationService;
import com.mihnea.restapi.dtos.auth.AuthenticationRequest;
import com.mihnea.restapi.dtos.auth.AuthenticationResponse;
import com.mihnea.restapi.dtos.auth.RegisterRequest;
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
