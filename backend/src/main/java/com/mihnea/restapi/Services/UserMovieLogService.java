package com.mihnea.restapi.Services;

import com.mihnea.restapi.Models.Movie;
import com.mihnea.restapi.Models.User;
import com.mihnea.restapi.Models.UserMovieLog;
import com.mihnea.restapi.Repositories.UserMovieLogRepository;
import com.mihnea.restapi.Repositories.UserRespository;
import com.mihnea.restapi.dtos.MovieDTO;
import com.mihnea.restapi.dtos.Requests.MovieLogRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserMovieLogService {
private final UserMovieLogRepository logRepository;
private final MovieService movieService;
private final UserRespository userRespository;

public void logMovie(Authentication authentication,MovieLogRequest request){
    User user=userRespository.getUserByEmail(authentication.getName()).orElseThrow(()->new RuntimeException("User not found"));
    Movie movie=movieService.getOrCreateMovie(request.getMovieId());

    UserMovieLog log=logRepository.findByUserIdAndMovieId(user.getId(), movie.getId()).orElse(UserMovieLog.builder().
            movie(movie).
            user(user).
            userWatchDates(new ArrayList<>())
            .build());

            log.setPersonalGrade(request.getPersonalGrade());
            log.getUserWatchDates().add(request.getWatchDate());

            logRepository.save(log);
}

    public List<MovieDTO> getUserLoggedMovies(Long userId){
        List<UserMovieLog> logs = logRepository.findByUserId(userId);
        return  logs.stream()
                .map(log -> {
                    Movie m = log.getMovie();
                    return new MovieDTO(m.getApiId(),m.getTitle(), m.getOverview(),m.getReleaseDate(),m.getPosterPath());
                })
                .collect(Collectors.toList());
    }

}
