package com.medipriority.service;

import com.medipriority.entity.Patient;
import com.medipriority.util.TriageUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QueueService {

    public List<Patient> buildQueue(List<Patient> patients) {
        return TriageUtil.sortByPriority(patients);
    }
}
