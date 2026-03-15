package com.mihnea.restapi.Authentication.config;

import com.mihnea.restapi.Authentication.Services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
@RequiredArgsConstructor
@Component
public class JwtAuthenticatinFilter extends OncePerRequestFilter {
    private final  UserDetailsService userDetailsService;
    private final JwtService jwtService;
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String bearer="Bearer ";
        final int bearerLenght=7;
        final String authHeader=request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

    if(authHeader ==null|| !authHeader.startsWith("Bearer ")){
        filterChain.doFilter(request,response);
        return;
    }
    jwt=authHeader.substring((bearerLenght));
    userEmail=jwtService.extractUsername(jwt);
    if(userEmail!=null&& SecurityContextHolder.getContext().getAuthentication()==null){
        UserDetails userDetails=this.userDetailsService.loadUserByUsername(userEmail);
        if(jwtService.isTokenValid(jwt,userDetails)){
            UsernamePasswordAuthenticationToken authToken= new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
    filterChain.doFilter(request,response);
    }

}
