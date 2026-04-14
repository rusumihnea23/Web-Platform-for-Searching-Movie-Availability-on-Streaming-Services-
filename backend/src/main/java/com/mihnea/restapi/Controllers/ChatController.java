package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Services.ChatService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/ask")
    public Map<String, String> ask(Authentication authentication, @RequestParam String prompt) {
        return Map.of("answer", chatService.getAiResponse(prompt,authentication));
    }
}