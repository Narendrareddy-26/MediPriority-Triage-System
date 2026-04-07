package com.medipriority.services;

import com.medipriority.models.Patient;
import com.medipriority.models.PatientDTO;
import com.medipriority.models.User;
import com.medipriority.repositories.PatientRepository;
import com.medipriority.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TriageService triageService;

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public Patient registerPatient(Patient patient, Long nurseId) throws Exception {
        Optional<User> nurse = userRepository.findById(nurseId);
        if (nurse.isEmpty() || !nurse.get().getRole().equals(User.Role.NURSE)) {
            throw new Exception("Invalid nurse");
        }

        patient.setNurse(nurse.get());
        patient.setStatus(Patient.Status.WAITING);
        patient.setRegisteredAt(LocalDateTime.now());
        // Initial triage is set by the nurse during registration

        return patientRepository.save(patient);
    }

    public List<PatientDTO> getActivePatientQueue() {
        List<Patient> patients = patientRepository.findAllActivePatientsByPriority();
        return patients.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PatientDTO> getAllPatientsSorted() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .filter(p -> !p.getStatus().equals(Patient.Status.COMPLETED))
                .sorted((p1, p2) -> p1.getTriageLevel().getPriority() - p2.getTriageLevel().getPriority())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PatientDTO> getPatientsByStatus(Patient.Status status) {
        List<Patient> patients = patientRepository.findByStatus(status);
        return patients.stream()
                .sorted((p1, p2) -> p1.getTriageLevel().getPriority() - p2.getTriageLevel().getPriority())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Patient updatePatientVitals(Long patientId, Integer heartRate, String bloodPressure) throws Exception {
        Optional<Patient> optionalPatient = patientRepository.findById(patientId);
        if (optionalPatient.isEmpty()) {
            throw new Exception("Patient not found");
        }

        Patient patient = optionalPatient.get();
        patient.setHeartRate(heartRate);
        patient.setBloodPressure(bloodPressure);

        // Recalculate triage level based on vitals
        Patient.TriageLevel newTriageLevel = triageService.calculateTriageLevel(heartRate, bloodPressure);
        patient.setTriageLevel(newTriageLevel);

        return patientRepository.save(patient);
    }

    public Patient assignDoctorToPatient(Long patientId, Long doctorId) throws Exception {
        Optional<Patient> optionalPatient = patientRepository.findById(patientId);
        Optional<User> optionalDoctor = userRepository.findById(doctorId);

        if (optionalPatient.isEmpty()) {
            throw new Exception("Patient not found");
        }
        if (optionalDoctor.isEmpty() || !optionalDoctor.get().getRole().equals(User.Role.DOCTOR)) {
            throw new Exception("Invalid doctor");
        }

        Patient patient = optionalPatient.get();
        patient.setDoctor(optionalDoctor.get());
        patient.setStatus(Patient.Status.IN_PROGRESS);
        patient.setSeenAt(LocalDateTime.now());

        return patientRepository.save(patient);
    }

    public Patient completePatient(Long patientId) throws Exception {
        Optional<Patient> optionalPatient = patientRepository.findById(patientId);
        if (optionalPatient.isEmpty()) {
            throw new Exception("Patient not found");
        }

        Patient patient = optionalPatient.get();
        patient.setStatus(Patient.Status.COMPLETED);
        patient.setCompletedAt(LocalDateTime.now());

        return patientRepository.save(patient);
    }

    public Patient updatePatientNotes(Long patientId, String notes) throws Exception {
        Optional<Patient> optionalPatient = patientRepository.findById(patientId);
        if (optionalPatient.isEmpty()) {
            throw new Exception("Patient not found");
        }

        Patient patient = optionalPatient.get();
        patient.setNotes(notes);

        return patientRepository.save(patient);
    }

    public PatientDTO convertToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setAge(patient.getAge());
        dto.setTriageLevel(patient.getTriageLevel().name());
        dto.setStatus(patient.getStatus().name());
        dto.setRegisteredAt(patient.getRegisteredAt().format(formatter));
        if (patient.getSeenAt() != null) {
            dto.setSeenAt(patient.getSeenAt().format(formatter));
        }
        if (patient.getCompletedAt() != null) {
            dto.setCompletedAt(patient.getCompletedAt().format(formatter));
        }
        dto.setDoctorName(patient.getDoctor() != null ? patient.getDoctor().getName() : null);
        dto.setNurseName(patient.getNurse() != null ? patient.getNurse().getName() : null);
        dto.setNotes(patient.getNotes());
        dto.setHeartRate(patient.getHeartRate());
        dto.setBloodPressure(patient.getBloodPressure());
        return dto;
    }
}
