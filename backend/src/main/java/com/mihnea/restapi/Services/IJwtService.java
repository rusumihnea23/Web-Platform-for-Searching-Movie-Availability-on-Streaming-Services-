package com.mihnea.restapi.Services;

import io.jsonwebtoken.Claims;

public interface IJwtService {
    public String extractUsername(String token);

}
