package com.mihnea.restapi.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UserLogDTO {
    private Long movieId;
   private  String title;
    private Float personalGrade;
    private List<LocalDate> watchDates;
    private String posterPath;
}
