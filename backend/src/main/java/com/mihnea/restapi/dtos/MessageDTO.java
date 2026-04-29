package com.mihnea.restapi.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

public record Message(
        String role,
        String content,
        @JsonInclude(JsonInclude.Include.NON_EMPTY) // This hides the field if the list is empty/null
        List<String> movies
) {
    public Message(String role, String content) {
        this(role, content, null); // Use null here so NON_EMPTY hides it
    }
}