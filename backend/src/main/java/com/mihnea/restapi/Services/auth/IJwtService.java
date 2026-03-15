package com.mihnea.restapi.Services.auth;

public interface IJwtService {
    public String extractUsername(String token);

}
