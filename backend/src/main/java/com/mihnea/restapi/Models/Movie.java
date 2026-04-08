package com.mihnea.restapi.Models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@Entity
@Table(name="movies")
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
    @SequenceGenerator(
            name = "user_sequence",
            allocationSize=1
    )
    @GeneratedValue(
            generator = "user_sequence",
            strategy = GenerationType.SEQUENCE
    )
    @Getter
    private Long id;
    @Setter
    @Getter
    private String Title;
    @Setter
    @Getter
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
