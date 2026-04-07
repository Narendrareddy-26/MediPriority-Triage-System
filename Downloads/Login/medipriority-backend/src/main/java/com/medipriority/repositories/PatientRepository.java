package com.medipriority.repositories;

import com.medipriority.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    @Query("SELECT p FROM Patient p WHERE p.status = 'WAITING' OR p.status = 'IN_PROGRESS' ORDER BY p.triageLevel ASC, p.registeredAt ASC")
    List<Patient> findAllActivePatientsByPriority();

    @Query("SELECT p FROM Patient p WHERE p.status = ?1 ORDER BY p.triageLevel ASC, p.registeredAt ASC")
    List<Patient> findPatientsByStatusOrderedByPriority(Patient.Status status);

    List<Patient> findByNurseId(Long nurseId);
    List<Patient> findByDoctorId(Long doctorId);
    List<Patient> findByStatus(Patient.Status status);
}
