package com.mihnea.restapi.Repositories;

import com.mihnea.restapi.Models.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Long> {


}
