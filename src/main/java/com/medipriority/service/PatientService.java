package com.medipriority.service;

import com.medipriority.dto.PatientRequest;
import com.medipriority.dto.VitalsRequest;
import com.medipriority.entity.Patient;
import com.medipriority.repository.PatientRepository;
import com.medipriority.util.TriageUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final QueueService queueService;

    public PatientService(PatientRepository patientRepository, QueueService queueService) {
        this.patientRepository = patientRepository;
        this.queueService = queueService;
    }

    public Patient registerPatient(PatientRequest request) {
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setAge(request.getAge());
        patient.setTriageLevel(request.getTriageLevel());
        patient.setStatus("WAITING");
        patient.setEmergency(false);
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());
        patient.getHistory().add("Patient registered with level " + request.getTriageLevel());

        return patientRepository.save(patient);
    }

    public Patient updateVitals(Long patientId, VitalsRequest request) {
        Patient patient = getPatient(patientId);

        patient.setHeartRate(request.getHeartRate());
        patient.setSystolicBp(request.getSystolicBp());
        patient.setDiastolicBp(request.getDiastolicBp());

        int oldLevel = patient.getTriageLevel();
        int updatedLevel = TriageUtil.calculateUpdatedLevel(
                oldLevel,
                request.getHeartRate(),
                request.getSystolicBp(),
                request.getDiastolicBp()
        );

        patient.setTriageLevel(updatedLevel);
        patient.setUpdatedAt(LocalDateTime.now());

        if (updatedLevel < oldLevel) {
            patient.getHistory().add("Vitals updated: level changed from " + oldLevel + " to " + updatedLevel);
        } else {
            patient.getHistory().add("Vitals updated: no change in level");
        }

        return patientRepository.save(patient);
    }

    public Patient emergencyOverride(Long patientId) {
        Patient patient = getPatient(patientId);

        patient.setTriageLevel(1);
        patient.setEmergency(true);
        patient.setUpdatedAt(LocalDateTime.now());
        patient.getHistory().add("Emergency override applied: moved to level 1");

        return patientRepository.save(patient);
    }

    public List<Patient> getQueue() {
        List<Patient> waitingPatients = patientRepository.findAll().stream()
                .filter(patient -> !"COMPLETED".equalsIgnoreCase(patient.getStatus()))
                .toList();

        return queueService.buildQueue(waitingPatients);
    }

    public Patient getPatient(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + patientId));
    }

    public List<String> getPatientHistory(Long patientId) {
        return getPatient(patientId).getHistory();
    }

    public Patient assignDoctor(Long patientId, Long doctorId, String doctorName) {
        Patient patient = getPatient(patientId);

        patient.setAssignedDoctorId(doctorId);
        patient.setAssignedDoctorName(doctorName);
        patient.setStatus("IN_PROGRESS");
        patient.setUpdatedAt(LocalDateTime.now());
        patient.getHistory().add("Assigned to doctor: " + doctorName + " (ID: " + doctorId + ")");

        return patientRepository.save(patient);
    }

    public Patient updateStatus(Long patientId, String status) {
        Patient patient = getPatient(patientId);

        patient.setStatus(status);
        patient.setUpdatedAt(LocalDateTime.now());
        patient.getHistory().add("Status updated to: " + status);

        return patientRepository.save(patient);
    }
}
