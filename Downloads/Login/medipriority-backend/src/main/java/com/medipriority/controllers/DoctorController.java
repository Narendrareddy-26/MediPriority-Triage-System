package com.medipriority.controllers;

import com.medipriority.models.Patient;
import com.medipriority.models.PatientDTO;
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
@RequestMapping("/api/doctor")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DoctorController {

    @Autowired
    private PatientService patientService;

    @GetMapping("/queue")
    public ResponseEntity<?> getPatientQueue() {
        try {
            List<PatientDTO> queue = patientService.getActivePatientQueue();
            return ResponseEntity.ok(queue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/patient/{patientId}/assign")
    public ResponseEntity<?> assignPatientToMe(
            @PathVariable Long patientId,
            Authentication auth) {
        try {
            Long doctorId = (Long) auth.getDetails();
            Patient patient = patientService.assignDoctorToPatient(patientId, doctorId);
            return ResponseEntity.ok(patientService.convertToDTO(patient));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/patient/{patientId}/complete")
    public ResponseEntity<?> completePatient(
            @PathVariable Long patientId,
            @RequestParam(required = false) String notes) {
        try {
            Patient patient = patientService.completePatient(patientId);
            if (notes != null && !notes.isEmpty()) {
                patient = patientService.updatePatientNotes(patientId, notes);
            }
            return ResponseEntity.ok(patientService.convertToDTO(patient));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/patient/{patientId}/notes")
    public ResponseEntity<?> updatePatientNotes(
            @PathVariable Long patientId,
            @RequestBody Map<String, String> request) {
        try {
            Patient patient = patientService.updatePatientNotes(patientId, request.get("notes"));
            return ResponseEntity.ok(patientService.convertToDTO(patient));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/completed-patients")
    public ResponseEntity<?> getCompletedPatients() {
        try {
            List<PatientDTO> completedPatients = patientService.getPatientsByStatus(Patient.Status.COMPLETED);
            return ResponseEntity.ok(completedPatients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
