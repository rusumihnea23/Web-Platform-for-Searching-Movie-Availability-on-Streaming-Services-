package com.mihnea.restapi.dtos.Response;

import com.mihnea.restapi.dtos.Message;

import java.util.List;

public record ChatResponse(List<Choice> choices) {
    public record Choice(Message message) {}
}