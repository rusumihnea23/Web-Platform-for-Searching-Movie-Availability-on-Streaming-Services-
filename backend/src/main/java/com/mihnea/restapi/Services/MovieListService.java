package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.*;
import com.mihnea.restapi.Repositories.MovieListLikeRepository;
import com.mihnea.restapi.Repositories.MovieListRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.*;
import com.mihnea.restapi.dtos.Requests.MovieListRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MovieListService {
    private final UserRespository userRespository;
    private final MovieListRepository listRepository;
    private final MovieService movieService;
    private final MovieListLikeRepository movieListLikeRepository;

    private Long getCurrentUserId(Authentication authentication) {
        if (authentication == null) return -1L;
        return userRespository.getUserByEmail(authentication.getName())
                .map(User::getId).orElse(-1L);
    }

    private ListMovieDTO mapToListDTO(MovieList list) {
        return ListMovieDTO.builder()
                .id(list.getId())
                .name(list.getName())
                .description(list.getDescription())
                .movies(list.getMovies().stream()
                        .map(movie -> new MovieDTO(
                                movie.getApiId(),
                                movie.getTitle(),
                                movie.getOverview(),
                                movie.getReleaseDate(),
                                movie.getPosterPath()
                        ))
                        .toList())
                .build();
    }

    private PublicListDTO mapToPublicDTO(MovieList list, Long currentUserId) {
        long likeCount = list.getLikes().size();
        boolean likedByMe = list.getLikes().stream()
                .anyMatch(like -> like.getUser().getId() == currentUserId);

        return PublicListDTO.builder()
                .id(list.getId())
                .name(list.getName())
                .description(list.getDescription())
                .ownerUsername(list.getOwner().getActualUsername())
                .likeCount(likeCount)
                .likedByMe(likedByMe)
                .movies(list.getMovies().stream()
                        .map(movie -> new MovieDTO(
                                movie.getApiId(),
                                movie.getTitle(),
                                movie.getOverview(),
                                movie.getReleaseDate(),
                                movie.getPosterPath()
                        ))
                        .toList())
                .build();
    }

    // --- Existing methods unchanged ---

    public List<ListMovieDTO> getListsByUserId(Long userId) {
        List<MovieList> userLists = listRepository.findByOwnerId(userId);
        return userLists.stream().map(this::mapToListDTO).toList();
    }

    public List<LightListMovieDTO> getAllLightList(Authentication authentication) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<MovieList> userLists = listRepository.findByOwnerId(user.getId());
        return userLists.stream()
                .map(list -> LightListMovieDTO.builder()
                        .id(list.getId())
                        .name(list.getName())
                        .build())
                .toList();
    }

    public ListMovieDTO getListById(Long listId) {
        MovieList list = listRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("List not found"));
        return mapToListDTO(list);
    }

    public List<ListMovieDTO> getAllListsFull(Authentication authentication) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getListsByUserId(user.getId());
    }

    public List<ListMovieDTO> getList(Authentication authentication, Long id) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findByOwnerIdAndId(user.getId(), id)
                .orElseThrow(() -> new RuntimeException("List not found or access denied"));
        return Collections.singletonList(mapToListDTO(movieList));
    }

    // --- NEW: Platform-wide lists with search + sort ---

    public List<PublicListDTO> getAllPlatformLists(Authentication authentication, String sortBy, String name) {
        Long currentUserId = getCurrentUserId(authentication);

        // For like-count sorting we fetch all and sort in memory (JPQL subquery + Sort not supported)
        List<MovieList> lists;
        if (sortBy != null && (sortBy.equalsIgnoreCase("popular") || sortBy.equalsIgnoreCase("least-liked"))) {
            lists = listRepository.findAllByNameContaining(name, Sort.unsorted());
            Comparator<MovieList> byLikes = Comparator.comparingLong(ml -> ml.getLikes().size());
            if (sortBy.equalsIgnoreCase("popular")) byLikes = byLikes.reversed();
            lists = lists.stream().sorted(byLikes).toList();
        } else {
            Sort sort = getListSortOrder(sortBy);
            lists = listRepository.findAllByNameContaining(name, sort);
        }

        return lists.stream()
                .map(list -> mapToPublicDTO(list, currentUserId))
                .toList();
    }

    // --- NEW: Toggle like on a list ---

    public void toggleListLike(Authentication authentication, Long listId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("List not found"));

        Optional<MovieListLike> existingLike = movieListLikeRepository.findByUserAndMovieList(user, movieList);
        if (existingLike.isPresent()) {
            movieListLikeRepository.delete(existingLike.get());
        } else {
            movieListLikeRepository.save(new MovieListLike(user, movieList));
        }
    }

    // --- NEW: Get lists liked by the current user ---

    public List<PublicListDTO> getLikedLists(Authentication authentication) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return movieListLikeRepository.findAll().stream()
                .filter(like -> like.getUser().getId() == user.getId())
                .map(like -> mapToPublicDTO(like.getMovieList(), user.getId()))
                .toList();
    }

    // --- Sort helper ---

    private Sort getListSortOrder(String sortBy) {
        if (sortBy == null) return Sort.by(Sort.Direction.ASC, "name");
        return switch (sortBy.toLowerCase()) {
            case "name-desc" -> Sort.by(Sort.Direction.DESC, "name");
            default -> Sort.by(Sort.Direction.ASC, "name");
        };
    }

    // --- Existing modification methods unchanged ---

    public void createList(Authentication authentication, MovieListRequest request) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = MovieList.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(user)
                .movies(new ArrayList<>())
                .build();
        if (request.getMovieId() != null) {
            Movie m = movieService.getOrCreateMovie(request.getMovieId());
            movieList.getMovies().add(m);
        }
        listRepository.save(movieList);
    }

    public void updateListDetails(Authentication authentication, Long listId, MovieListRequest request) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findByOwnerIdAndId(user.getId(), listId)
                .orElseThrow(() -> new RuntimeException("List not found or access denied"));
        if (request.getName() != null) movieList.setName(request.getName());
        if (request.getDescription() != null) movieList.setDescription(request.getDescription());
        listRepository.save(movieList);
    }

    public void addMovieToList(Authentication authentication, Long listId, Long movieId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findByOwnerIdAndId(user.getId(), listId)
                .orElseThrow(() -> new RuntimeException("List not found or access denied"));
        Movie movie = movieService.getOrCreateMovie(movieId);
        if (!movieList.getMovies().contains(movie)) {
            movieList.getMovies().add(movie);
            listRepository.save(movieList);
        } else throw new RuntimeException("List already contains movie");
    }

    public void removeMovieFromList(Authentication authentication, Long listId, Long movieId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findByOwnerIdAndId(user.getId(), listId)
                .orElseThrow(() -> new RuntimeException("List not found or access denied"));
        Movie movie = movieService.getOrCreateMovie(movieId);
        if (movieList.getMovies().contains(movie)) {
            movieList.getMovies().remove(movie);
            listRepository.save(movieList);
        } else throw new RuntimeException("List doesn't contain movie");
    }

    public void deleteList(Authentication authentication, Long listId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findByOwnerIdAndId(user.getId(), listId)
                .orElseThrow(() -> new RuntimeException("List not found or access denied"));
        listRepository.delete(movieList);
    }
}