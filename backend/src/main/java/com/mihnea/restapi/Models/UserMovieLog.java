package com.mihnea.restapi.Models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Builder
@Entity
@Table(name="user_movie_log")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserMovieLog {

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

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name="movie_id")
    private Movie movie;
    @Getter
    @Setter
    private Float personalGrade;

    @ElementCollection
    @CollectionTable(name = "user_movie_watch_dates", joinColumns = @JoinColumn(name = "log_id"))
    @Column(name = "watch_date")
    private List<LocalDate> userWatchDates;

}
