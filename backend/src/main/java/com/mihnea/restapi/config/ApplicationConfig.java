package com.mihnea.restapi.config;

import com.mihnea.restapi.Repositories.UserRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final UserRespository repository;

    @Bean
    public UserDetailsService userDetailsService(){
        return username -> repository.getUserByEmail(username).orElseThrow(()->  (new UsernameNotFoundException("User Not Found")));
    }

}
