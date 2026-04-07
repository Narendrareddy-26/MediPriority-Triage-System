package com.medipriority.controller;

import com.medipriority.dto.PatientRequest;
import com.medipriority.dto.VitalsRequest;
import com.medipriority.entity.Patient;
import com.medipriority.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public Patient registerPatient(@Valid @RequestBody PatientRequest request) {
        return patientService.registerPatient(request);
    }

    @PutMapping("/{id}/vitals")
    public Patient updateVitals(@PathVariable Long id, @Valid @RequestBody VitalsRequest request) {
        return patientService.updateVitals(id, request);
    }

    @PutMapping("/{id}/emergency")
    public Patient emergencyOverride(@PathVariable Long id) {
        return patientService.emergencyOverride(id);
    }

    @GetMapping("/queue")
    public List<Patient> getQueue() {
        return patientService.getQueue();
    }

    @GetMapping("/{id}")
    public Patient getPatient(@PathVariable Long id) {
        return patientService.getPatient(id);
    }

    @GetMapping("/{id}/history")
    public List<String> getPatientHistory(@PathVariable Long id) {
        return patientService.getPatientHistory(id);
    }

    @PutMapping("/{id}/assign")
    public Patient assignDoctor(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Long doctorId = Long.valueOf(body.get("doctorId").toString());
        String doctorName = body.get("doctorName").toString();
        return patientService.assignDoctor(id, doctorId, doctorName);
    }

    @PutMapping("/{id}/status")
    public Patient updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return patientService.updateStatus(id, status);
    }
}
