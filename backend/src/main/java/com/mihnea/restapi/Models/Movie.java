package com.mihnea.restapi.Models;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Builder
@Entity
@Table(name="movies")
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;
    @Setter
    @Getter
    private String Title;
    @Setter
    @Getter
    @Column(unique = true)
    private Long apiId;
    @Setter
    @Getter
    @Column(columnDefinition = "TEXT")
    private String overview;
    @Setter
    @Getter
    private String releaseDate;
    @Getter
    @Setter
    private String posterPath;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<Review> reviews;

    @OneToMany(mappedBy = "movie")
    private List<UserMovieLog> userMovieLog;
    //genres& genreIds
    @ManyToMany
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    @Getter
    @Setter
    @Builder.Default
    private Set<Genre> genres=new HashSet<>();

    @Override
    public String toString() {
        return "Movie{" +
                "releaseDate='" + releaseDate + '\'' +
                ", overview='" + overview + '\'' +
                ", Title='" + Title + '\'' +
                ", apiId=" + apiId +
                ", id=" + id +
                '}';
    }
}
