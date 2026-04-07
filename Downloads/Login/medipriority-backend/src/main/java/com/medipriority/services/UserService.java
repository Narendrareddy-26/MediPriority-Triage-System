package com.medipriority.services;

import com.medipriority.models.User;
import com.medipriority.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) throws Exception {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new Exception("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);

        return userRepository.save(user);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public User getUserById(Long id) throws Exception {
        return userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found"));
    }
}
