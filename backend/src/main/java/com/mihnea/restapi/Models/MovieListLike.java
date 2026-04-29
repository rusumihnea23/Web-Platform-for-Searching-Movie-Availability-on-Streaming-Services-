package com.mihnea.restapi.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "movie_list_likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieListLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "list_id")
    private MovieList movieList;

    public MovieListLike(User user, MovieList movieList) {
        this.user = user;
        this.movieList = movieList;
    }
}