package com.mihnea.restapi.dtos.Requests;

import java.util.List;

public record ChatRequest(String model, List<com.mihnea.restapi.dtos.ChatApiMessage> messages) {}