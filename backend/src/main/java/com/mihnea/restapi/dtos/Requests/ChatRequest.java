package com.mihnea.restapi.dtos.Requests;

import com.mihnea.restapi.dtos.ChatApiMessageDTO;

import java.util.List;

public record ChatRequest(String model, List<ChatApiMessageDTO> messages) {}