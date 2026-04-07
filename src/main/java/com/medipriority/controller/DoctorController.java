package com.medipriority.controller;

import com.medipriority.entity.Patient;
import com.medipriority.service.DoctorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Patient> getPatientsByDoctorId(@PathVariable Long doctorId) {
        return doctorService.getPatientsByDoctorId(doctorId);
    }
}
