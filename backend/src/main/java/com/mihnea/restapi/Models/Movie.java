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
    private Long id;
    @Setter
    @Getter
    private String Title;
    @Setter
    @Getter
    private Long apiId;
    @Setter
    @Getter
    private String overview;
    @Setter
    @Getter
    private String releaseDate;
    @Getter
    @Setter
    private String posterPath;



    //genres& genreIds



}
