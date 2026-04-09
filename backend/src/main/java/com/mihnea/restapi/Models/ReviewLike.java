package com.mihnea.restapi.Models;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "review_id")
    private Review review;

    public ReviewLike(User user, Review review) {
        this.user = user;
        this.review = review;
    }
}