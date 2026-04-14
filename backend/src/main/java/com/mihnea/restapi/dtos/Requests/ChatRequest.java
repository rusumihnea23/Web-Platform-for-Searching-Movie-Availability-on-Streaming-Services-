package com.mihnea.restapi.dtos.Requests;

import com.mihnea.restapi.dtos.Message;

import java.util.List;

public record ChatRequest(String model, List<Message> messages) {}