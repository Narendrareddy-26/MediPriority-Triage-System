package com.medipriority.util;

import com.medipriority.entity.Patient;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class TriageUtil {

    private TriageUtil() {
    }

    public static List<Patient> sortByPriority(List<Patient> patients) {
        return patients.stream()
                .sorted(Comparator
                        .comparing(Patient::getTriageLevel)
                        .thenComparing(Patient::getCreatedAt))
                .collect(Collectors.toList());
    }

    public static int calculateUpdatedLevel(int currentLevel, int heartRate, int systolicBp, int diastolicBp) {
        boolean hrAbnormal = heartRate > 120 || heartRate < 50;
        boolean bpAbnormal = systolicBp > 180 || systolicBp < 90 || diastolicBp > 120 || diastolicBp < 60;

        if (hrAbnormal || bpAbnormal) {
            return Math.max(1, currentLevel - 1);
        }

        return currentLevel;
    }
}
