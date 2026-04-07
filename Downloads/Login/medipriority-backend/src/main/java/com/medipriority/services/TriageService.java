package com.medipriority.services;

import com.medipriority.models.Patient;
import org.springframework.stereotype.Service;

@Service
public class TriageService {

    /**
     * Calculate triage level based on vital signs (HR and BP only)
     * Level 1: Critical - HR > 130 or < 40, SBP > 200 or < 80
     * Level 2: Emergency - HR > 110 or < 50, SBP > 180 or < 90
     * Level 3: Urgent - HR > 100 or < 60, SBP > 160 or < 100
     * Level 4: Semi-Urgent - Moderately abnormal vitals
     * Level 5: Non-Urgent - Normal vitals
     */
    public Patient.TriageLevel calculateTriageLevel(Integer heartRate, String bloodPressure) {
        if (heartRate == null || bloodPressure == null || bloodPressure.isEmpty()) {
            return Patient.TriageLevel.LEVEL_5;
        }

        try {
            // Parse blood pressure (format: "SBP/DBP")
            String[] bpValues = bloodPressure.split("/");
            Integer systolic = Integer.parseInt(bpValues[0].trim());

            // Check Heart Rate - Critical
            if (heartRate > 130 || heartRate < 40) {
                return Patient.TriageLevel.LEVEL_1;
            }

            // Check Systolic Blood Pressure - Critical
            if (systolic > 200 || systolic < 80) {
                return Patient.TriageLevel.LEVEL_1;
            }

            // Check Heart Rate - Emergency
            if (heartRate > 110 || heartRate < 50) {
                return Patient.TriageLevel.LEVEL_2;
            }

            // Check Systolic Blood Pressure - Emergency
            if (systolic > 180 || systolic < 90) {
                return Patient.TriageLevel.LEVEL_2;
            }

            // Check Heart Rate - Urgent
            if (heartRate > 100 || heartRate < 60) {
                return Patient.TriageLevel.LEVEL_3;
            }

            // Check Systolic Blood Pressure - Urgent
            if (systolic > 160 || systolic < 100) {
                return Patient.TriageLevel.LEVEL_3;
            }

            // Check Heart Rate - Semi-Urgent
            if (heartRate > 90 || heartRate < 65) {
                return Patient.TriageLevel.LEVEL_4;
            }

            // Check Systolic Blood Pressure - Semi-Urgent
            if (systolic > 150 || systolic < 110) {
                return Patient.TriageLevel.LEVEL_4;
            }

            return Patient.TriageLevel.LEVEL_5;
        } catch (Exception e) {
            return Patient.TriageLevel.LEVEL_5;
        }
    }
}
