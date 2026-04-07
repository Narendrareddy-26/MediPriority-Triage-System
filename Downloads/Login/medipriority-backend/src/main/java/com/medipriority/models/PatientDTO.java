package com.medipriority.models;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    private Long id;
    private String name;
    private Integer age;
    private String triageLevel;
    private String status;
    private String registeredAt;
    private String seenAt;
    private String completedAt;
    private String doctorName;
    private String nurseName;
    private String notes;
    private Integer heartRate;
    private String bloodPressure;
}
