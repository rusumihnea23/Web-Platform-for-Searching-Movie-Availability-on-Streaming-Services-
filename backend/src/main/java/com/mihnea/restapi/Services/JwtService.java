package com.mihnea.restapi.Services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService implements IJwtService {
    private static final String SECRET_KEY="7aab3384a904886d6b677dd3ce3fbaec731642bf7fc80f6254be3b283efb4be7"; //todo de pus in alta parte

    @Override
    public String extractUsername(String token) {
        return extractClaims(token,Claims::getSubject);
    }
    public <T> T extractClaims(String token, Function<Claims,T> claimsTFunction){
        final Claims claims=extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }
    protected Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSingInKey()).build().parseClaimsJws(token).getBody();
    }

    private Key getSingInKey() {
        byte[] keyBytes= Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(),userDetails);
    }
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails){
        return  Jwts.builder().setClaims(extraClaims).setSubject(userDetails
                .getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+1000*60 *12))
                .signWith(getSingInKey(), SignatureAlgorithm.ES256).compact();
    }
    public boolean isTokenValid(String token,UserDetails userDetails){
        final String username=extractUsername(token);
        return (username.equals(userDetails.getUsername())) && isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaims(token,Claims::getExpiration);
    }
}
