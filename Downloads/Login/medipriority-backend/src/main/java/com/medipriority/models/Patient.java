package com.medipriority.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TriageLevel triageLevel = TriageLevel.LEVEL_5;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.WAITING;

    // Vital Signs
    private Integer heartRate;
    private String bloodPressure;

    @Column(nullable = false)
    private LocalDateTime registeredAt = LocalDateTime.now();

    private LocalDateTime seenAt;

    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private User doctor;

    @ManyToOne
    @JoinColumn(name = "nurse_id")
    private User nurse;

    @Column(length = 500)
    private String notes;

    public enum TriageLevel {
        LEVEL_1("Critical", 1),
        LEVEL_2("Emergency", 2),
        LEVEL_3("Urgent", 3),
        LEVEL_4("Semi-Urgent", 4),
        LEVEL_5("Non-Urgent", 5);

        private final String description;
        private final int priority;

        TriageLevel(String description, int priority) {
            this.description = description;
            this.priority = priority;
        }

        public String getDescription() {
            return description;
        }

        public int getPriority() {
            return priority;
        }
    }

    public enum Status {
        WAITING, IN_PROGRESS, COMPLETED
    }
}
