package com.mihnea.restapi.dtos.Response;

import com.mihnea.restapi.dtos.DailyTrendDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor // <--- THIS IS THE MAGIC FIX
    public class ChartDataResponse {
        private List<DailyTrendDTO> chartData;
        private double average;
}
