package com.medipriority.controllers;

import com.medipriority.models.Patient;
import com.medipriority.models.PatientDTO;
import com.medipriority.models.VitalsRequest;
import com.medipriority.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class NurseController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/patient/register")
    public ResponseEntity<?> registerPatient(@RequestBody Patient patient, Authentication auth) {
        try {
            Long nurseId = (Long) auth.getDetails();
            Patient registeredPatient = patientService.registerPatient(patient, nurseId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(patientService.convertToDTO(registeredPatient));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/patient/{patientId}/vitals")
    public ResponseEntity<?> updatePatientVitals(
            @PathVariable Long patientId,
            @RequestBody VitalsRequest vitalsRequest) {
        try {
            Patient updatedPatient = patientService.updatePatientVitals(
                    patientId,
                    vitalsRequest.getHeartRate(),
                    vitalsRequest.getBloodPressure()
            );
            return ResponseEntity.ok(patientService.convertToDTO(updatedPatient));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<?> getNursePatients(Authentication auth) {
        try {
            Long nurseId = (Long) auth.getDetails();
            // This would typically filter patients by nurse
            List<PatientDTO> patients = patientService.getPatientsByStatus(Patient.Status.WAITING);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
