package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Models.MovieList;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Repositories.MovieListRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.LightListMovieDTO;
import com.mihnea.restapi.dtos.ListMovieDTO;
import com.mihnea.restapi.dtos.MovieDTO;
import com.mihnea.restapi.dtos.Requests.MovieListRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MovieListService {
private  final UserRespository userRespository;
private final MovieListRepository listRepository;
private final MovieService movieService;
    public void createList(Authentication authentication, MovieListRequest request){
        User user=userRespository.getUserByEmail(authentication.getName()).orElseThrow(()->new RuntimeException("User not found"));
        Movie m = null;

        MovieList movieList= (MovieList.builder()
                        .name(request.getName())
                        .description(request.getDescription())
                        .owner(user)
                .movies(new ArrayList<>())
                        .build());
        if(request.getMovieId()!=null) {
            m = movieService.getOrCreateMovie(request.getMovieId());
            movieList.getMovies().add(m);
        }
        listRepository.save(movieList);
}
        public List<LightListMovieDTO> getAllLightList(Authentication authentication){
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
    public List<ListMovieDTO> getAllListsFull(Authentication authentication) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<MovieList> userLists = listRepository.findByOwnerId(user.getId());

        return userLists.stream()
                .map(list -> ListMovieDTO.builder()
                        .id(list.getId())
                        .name(list.getName())
                        .description(list.getDescription())
                        .movies(list.getMovies().stream()
                                .map(movie -> new MovieDTO(
                                        movie.getId(),
                                        movie.getTitle(),
                                        movie.getOverview(),
                                        movie.getReleaseDate(),
                                        movie.getPosterPath()
                                ))
                                .toList())
                        .build())
                .toList();
    }

    public List<ListMovieDTO> getList(Authentication authentication,Long id) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findByOwnerIdAndId(user.getId(), id)
                .orElseThrow(() -> new RuntimeException("List not found or access denied"));
        return Collections.singletonList(ListMovieDTO.builder()
                .id(movieList.getId())
                .name(movieList.getName())
                .description(movieList.getDescription())
                .movies(movieList.getMovies().stream()
                        .map(movie -> new MovieDTO(
                                movie.getId(),
                                movie.getTitle(),
                                movie.getOverview(),
                                movie.getReleaseDate(),
                                movie.getPosterPath()
                        ))
                        .toList())
                .build());

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
        }
    }


    public void removeMovieFromList(Authentication authentication, Long listId, Long movieId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findByOwnerIdAndId(user.getId(), listId)
                .orElseThrow(() -> new RuntimeException("List not found or access denied"));
        movieList.getMovies().removeIf(m -> m.getId().equals(movieId));
        listRepository.save(movieList);
    }


    public void updateListDetails(Authentication authentication, Long listId, MovieListRequest request) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findByOwnerIdAndId(user.getId(), listId)
                .orElseThrow(() -> new RuntimeException("List not found or access denied"));
        if (request.getName() != null) {
            movieList.setName(request.getName());
        }
        if (request.getDescription() != null) {
            movieList.setDescription(request.getDescription());
        }
        listRepository.save(movieList);
    }


    public void deleteList(Authentication authentication, Long listId) {
        User user = userRespository.getUserByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MovieList movieList = listRepository.findByOwnerIdAndId(user.getId(), listId)
                .orElseThrow(() -> new RuntimeException("List not found or access denied"));
        listRepository.delete(movieList);
    }
}
