package com.medipriority.controllers;

import com.medipriority.models.*;
import com.medipriority.security.JwtTokenProvider;
import com.medipriority.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> user = userService.findUserByUsername(loginRequest.getUsername());

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            User foundUser = user.get();
            if (!foundUser.getActive()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User account is inactive");
            }

            if (!userService.validatePassword(loginRequest.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            String token = tokenProvider.generateToken(foundUser.getId(), foundUser.getUsername(), foundUser.getRole().toString());

            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setUserId(foundUser.getId());
            response.setUsername(foundUser.getUsername());
            response.setRole(foundUser.getRole().toString());
            response.setName(foundUser.getName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed");
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token");
            }
            String actualToken = token.substring(7);
            boolean isValid = tokenProvider.validateToken(actualToken);

            if (isValid) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("username", tokenProvider.extractUsername(actualToken));
                response.put("role", tokenProvider.extractRole(actualToken));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is invalid or expired");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token validation failed");
        }
    }
}
