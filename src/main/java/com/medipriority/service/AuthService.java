package com.medipriority.service;

import com.medipriority.dto.AuthRequest;
import com.medipriority.entity.User;
import com.medipriority.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(AuthRequest request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(user -> {
            throw new IllegalArgumentException("Username already exists");
        });

        String role = request.getRole().toUpperCase(Locale.ROOT);
        if (!role.equals("NURSE") && !role.equals("DOCTOR")) {
            throw new IllegalArgumentException("Role must be NURSE or DOCTOR");
        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRole(role);

        return userRepository.save(user);
    }

    public Map<String, Object> login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return Map.of(
                "message", "Login successful",
                "userId", user.getId(),
                "name", user.getName(),
                "username", user.getUsername(),
                "role", user.getRole()
        );
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
