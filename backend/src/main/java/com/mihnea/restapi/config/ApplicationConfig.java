package com.mihnea.restapi.config;

import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.MovieMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final UserRespository repository;

    @Bean
    public UserDetailsService userDetailsService(){
        return username -> repository.getUserByEmail(username).orElseThrow(()->  (new UsernameNotFoundException("User Not Found")));
    }
    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider=new DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }
    @Value("${tmdb.api.key}")
    private String tmdbApiKey;
    @Bean
    public WebClient webClient(WebClient.Builder builder){
        return builder.baseUrl("https://api.themoviedb.org/3")
                .defaultHeader("Authorization", "Bearer " + tmdbApiKey
                        )
                .codecs(configurer ->
                        configurer.defaultCodecs()
                                .maxInMemorySize(2 * 1024 * 1024))//todo api key care sa fie sigura cand dau push pe git
                .build();
    }
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
    @Bean
    MovieMapper movieMapper(){
        return new MovieMapper();
    }
}
