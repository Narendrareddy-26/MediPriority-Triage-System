package com.medipriority.models;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VitalsRequest {
    private Integer heartRate;
    private String bloodPressure;
}
