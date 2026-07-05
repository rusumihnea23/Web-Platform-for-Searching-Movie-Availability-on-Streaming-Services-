package com.mihnea.restapi.config;

import com.mihnea.restapi.Models.*;
import com.mihnea.restapi.Repositories.*;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final GenreRepository genreRepository;
    private final MovieRepository movieRepository;
    private final UserRespository userRepository; // Kept your exact repository spelling
    private final ReviewRepository reviewRepository;
    private final MovieListRepository movieListRepository;
    private final UserMovieLogRepository userMovieLogRepository;

    private final Faker faker = new Faker();
    private final Random random = new Random();

    // A list of realistic review templates to produce high-quality human critiques
    private final List<String> reviewTemplates = List.of(
            "An absolute masterpiece! The direction and cinematography were flawless.",
            "Honestly, it started strong but the second half felt dragged out and predictable.",
            "A brilliant cinematic experience. The acting by the lead cast was top-tier.",
            "Great visuals and amazing soundtrack, but the plot had way too many plot holes.",
            "I didn't expect much going in, but I was pleasantly surprised. Highly recommend!",
            "A bit overhyped in my opinion. It's good, but definitely not a classic.",
            "The pacing was completely off, but the emotional climax saved the entire film.",
            "Pure cinematic gold. I've watched it three times already and it never gets old.",
            "An entertaining ride from start to finish. Perfect for a weekend movie night.",
            "The visuals were stunning, but it lacked the emotional depth of the original story."
    );

    public DatabaseSeeder(GenreRepository genreRepository, MovieRepository movieRepository,
                          UserRespository userRepository, ReviewRepository reviewRepository,
                          MovieListRepository movieListRepository, UserMovieLogRepository userMovieLogRepository) {
        this.genreRepository = genreRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.movieListRepository = movieListRepository;
        this.userMovieLogRepository = userMovieLogRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Official TMDB Genres if they don't exist yet
        if (genreRepository.count() == 0) {
            System.out.println("🎬 Seeding official TMDB genres...");
            Map<Long, String> tmdbGenres = Map.ofEntries(
                    Map.entry(28L, "Action"), Map.entry(12L, "Adventure"), Map.entry(16L, "Animation"),
                    Map.entry(35L, "Comedy"), Map.entry(80L, "Crime"), Map.entry(99L, "Documentary"),
                    Map.entry(18L, "Drama"), Map.entry(10751L, "Family"), Map.entry(14L, "Fantasy"),
                    Map.entry(36L, "History"), Map.entry(27L, "Horror"), Map.entry(10402L, "Music"),
                    Map.entry(9648L, "Mystery"), Map.entry(10749L, "Romance"), Map.entry(878L, "Sci-Fi"),
                    Map.entry(10770L, "TV Movie"), Map.entry(53L, "Thriller"), Map.entry(10752L, "War"),
                    Map.entry(37L, "Western")
            );

            tmdbGenres.forEach((id, name) -> {
                Genre genre = Genre.builder().id(id).name(name).build();
                genreRepository.save(genre);
            });
        }

        // Prevent seeding artificial users/reviews if users already exist
        if (userRepository.count() > 0) {
            System.out.println("Database already contains user data. Skipping artificial seeding.");
            return;
        }

        // Fetch the real movies imported by the Python script
        List<Movie> realMovies = movieRepository.findAll();
        if (realMovies.isEmpty()) {
            System.out.println("No movies found in the database. Run Python TMDB script first!");
            return;
        }

        System.out.println(" Initializing artificial user data generation around " + realMovies.size() + " real TMDB movies...");

        // 2. Seed Users
        List<User> users = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String email = faker.internet().emailAddress(firstName.toLowerCase() + "." + lastName.toLowerCase());

            User user = User.builder()
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .username(faker.credentials().username())
                    .password("{noop}password123")
                    .role(i == 0 ? Role.ROLE_ADMIN : Role.ROLE_USER)
                    .profilePicturePath("https://api.dicebear.com/7.x/avataaars/svg?seed=" + firstName)
                    .build();
            users.add(user);
        }
        users = userRepository.saveAll(users);

        // 4. Update Users with Random Watchlists
        for (User user : users) {
            List<Movie> watchlist = new ArrayList<>();
            int watchlistSize = random.nextInt(5);
            for (int i = 0; i < watchlistSize; i++) {
                watchlist.add(realMovies.get(random.nextInt(realMovies.size())));
            }
            user.setWatchlist(watchlist);
            userRepository.save(user);
        }

        // 5. Seed Reviews & Review Likes (With historical timestamp injection for beautiful charts)
        System.out.println(" Writing audience reviews with historical trend data...");
        for (int i = 0; i < Math.min(realMovies.size(), 120); i++) {
            Movie movie = realMovies.get(random.nextInt(realMovies.size()));
            int reviewCount = random.nextInt(3) + 1;

            for (int j = 0; j < reviewCount; j++) {
                User randomUser = users.get(random.nextInt(users.size()));
                String realisticReviewText = reviewTemplates.get(random.nextInt(reviewTemplates.size()));

                // 📅 DISTRIBUTE REVIEWS RADIALLY OVER THE PAST 30 DAYS
                java.time.LocalDateTime randomHistoricalDate = faker.timeAndDate()
                        .past(30, TimeUnit.DAYS)
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime();

                Review review = Review.builder()
                        .content(realisticReviewText)
                        .user(randomUser)
                        .movie(movie)
                        .createdAt(randomHistoricalDate) // Overrides default timestamp
                        .build();

                List<ReviewLike> reviewLikes = new ArrayList<>();
                int likeCount = random.nextInt(6);
                for (int k = 0; k < likeCount; k++) {
                    reviewLikes.add(new ReviewLike(users.get(random.nextInt(users.size())), review));
                }
                review.setLikes(reviewLikes);
                reviewRepository.save(review);
            }
        }

        // 6. Seed Custom Movie Lists & List Likes
        for (int i = 0; i < 15; i++) {
            User owner = users.get(random.nextInt(users.size()));
            List<Movie> listMovies = new ArrayList<>();
            for (int j = 0; j < random.nextInt(6) + 2; j++) {
                listMovies.add(realMovies.get(random.nextInt(realMovies.size())));
            }

            MovieList movieList = MovieList.builder()
                    .name(faker.book().genre() + " Collection")
                    .description(faker.lorem().sentence())
                    .owner(owner)
                    .movies(listMovies)
                    .build();

            List<MovieListLike> listLikes = new ArrayList<>();
            for (int k = 0; k < random.nextInt(8); k++) {
                listLikes.add(new MovieListLike(users.get(random.nextInt(users.size())), movieList));
            }
            movieList.setLikes(listLikes);
            movieListRepository.save(movieList);
        }

        // 7. Seed User Movie Logs / History
        for (User user : users) {
            int loggedMoviesCount = random.nextInt(5);
            for (int i = 0; i < loggedMoviesCount; i++) {
                Movie randomMovie = realMovies.get(random.nextInt(realMovies.size()));

                List<LocalDate> watchDates = List.of(
                        faker.timeAndDate().past(365, TimeUnit.DAYS).atZone(ZoneId.systemDefault()).toLocalDate()
                );

                UserMovieLog log = UserMovieLog.builder()
                        .user(user)
                        .movie(randomMovie)
                        .personalGrade((float) (random.nextInt(5) + 6))
                        .userWatchDates(watchDates)
                        .build();

                userMovieLogRepository.save(log);
            }
        }

        System.out.println("✅ Database populated with fake activity around real TMDB movies successfully!");
    }
}