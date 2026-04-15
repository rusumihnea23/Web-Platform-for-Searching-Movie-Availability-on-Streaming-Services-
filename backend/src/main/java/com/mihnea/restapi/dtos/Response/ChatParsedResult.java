package com.mihnea.restapi.dtos.Response;

import java.util.List;

public record ChatParsedResult(String message, List<String> movies) {}