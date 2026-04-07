package com.medipriority.models;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long userId;
    private String username;
    private String role;
    private String name;
}
