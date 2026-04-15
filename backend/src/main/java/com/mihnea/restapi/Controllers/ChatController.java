package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Services.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
        return Map.of("answer", chatService.getAiResponse(prompt, authentication));
    }

    @PatchMapping("/delete")
    public ResponseEntity<String> deleteChat(Authentication authentication) {
        chatService.clearHistory(authentication);
        return ResponseEntity.ok("Deleted chat succesfuly");
    }
}