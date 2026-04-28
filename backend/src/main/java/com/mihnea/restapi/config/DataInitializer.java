package com.mihnea.restapi.config;

import com.mihnea.restapi.Models.Genre;
import com.mihnea.restapi.Models.Role;
import com.mihnea.restapi.Repositories.GenreRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import lombok.RequiredArgsConstructor;
import com.mihnea.restapi.Models.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@RequiredArgsConstructor
@Component
public class DataInitializer implements CommandLineRunner {

    public final GenreRepository genreRepository;
    public final UserRespository userRespository;
    private final PasswordEncoder passwordEncoder;
    public void run(String... args) throws Exception {

        List<Genre> tmdbGenres = List.of(
                new Genre(28L, "Action", null),
                new Genre(12L, "Adventure", null),
                new Genre(16L, "Animation", null),
                new Genre(35L, "Comedy", null),
                new Genre(80L, "Crime", null),
                new Genre(99L, "Documentary", null),
                new Genre(18L, "Drama", null),
                new Genre(10751L, "Family", null),
                new Genre(14L, "Fantasy", null),
                new Genre(36L, "History", null),
                new Genre(27L, "Horror", null),
                new Genre(10402L, "Music", null),
                new Genre(9648L, "Mystery", null),
                new Genre(10749L, "Romance", null),
                new Genre(878L, "Science Fiction", null),
                new Genre(10770L, "TV Movie", null),
                new Genre(53L, "Thriller", null),
                new Genre(10752L, "War", null),
                new Genre(37L, "Western", null)
        );

        if(userRespository.getUserByEmail("admin2").isPresent())
            System.out.println("admin already exist");
        else {
//            var admin = User.builder()
//                    .firstName("Admin")
//                    .lastName("User")
//                    .email("admin@test.com")
//                    .password(passwordEncoder.encode("password"))
//                    .role(Role.ROLE_ADMIN)
//                    .username("admin")
//                    .build();

//            userRespository.save(admin);
            System.out.println("admin created");
        }

        genreRepository.saveAll(tmdbGenres);
    }
}