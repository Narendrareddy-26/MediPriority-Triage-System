package com.medipriority.controller;

import com.medipriority.dto.AuthRequest;
import com.medipriority.entity.User;
import com.medipriority.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/register")
    public User register(@Valid @RequestBody AuthRequest request) {
        return authService.register(request);
    }

    @PostMapping("/auth/login")
    public Map<String, Object> login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }
}
