package com.medipriority.service;

import com.medipriority.entity.Patient;
import com.medipriority.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final PatientRepository patientRepository;

    public DoctorService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getPatientsByDoctorId(Long doctorId) {
        return patientRepository.findByAssignedDoctorId(doctorId);
    }
}
