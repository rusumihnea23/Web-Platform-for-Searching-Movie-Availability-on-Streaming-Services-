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
}
