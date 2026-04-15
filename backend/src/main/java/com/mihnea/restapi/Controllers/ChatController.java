package com.mihnea.restapi.Controllers;

import com.mihnea.restapi.Services.ChatService;
import com.mihnea.restapi.dtos.Message;
import com.mihnea.restapi.dtos.Response.ChatParsedResult;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/ask")
    public ChatParsedResult ask(Authentication authentication, @RequestParam String prompt) {
        // chatService.getAiResponse now returns the structured ChatParsedResult object
        return chatService.getAiResponse(prompt, authentication);
    }

    @PatchMapping("/delete")
    public ResponseEntity<String> deleteChat(Authentication authentication) {
        chatService.clearHistory(authentication);
        return ResponseEntity.ok("Deleted chat succesfuly");
    }
    @GetMapping("/history")
    public List<Message> getHistory(Authentication authentication) {
        return chatService.getHistory(authentication);
    }
}