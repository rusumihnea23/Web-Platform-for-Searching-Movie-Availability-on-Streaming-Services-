package com.mihnea.restapi.Models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Builder
@Entity
@Table(name="genre")
@NoArgsConstructor
@AllArgsConstructor
@Getter // Class-level is better
@Setter // Hibernate needs setters to populate data from the DB
public class Genre {

    @Id
    private Long id;

    private String name;

    @ManyToMany(mappedBy = "genres")
    private Set<Movie> movies;
}