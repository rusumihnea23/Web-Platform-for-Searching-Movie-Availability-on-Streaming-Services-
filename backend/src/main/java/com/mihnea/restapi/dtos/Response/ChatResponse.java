package com.mihnea.restapi.dtos.Response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mihnea.restapi.dtos.MessageDTO;

import java.awt.*;
import java.util.List;

public record ChatResponse(List<Choice> choices) {
    // Tell Jackson to look for "message" in the JSON and put it in messageDTO
    public record Choice(@JsonProperty("message") MessageDTO messageDTO) {}
}