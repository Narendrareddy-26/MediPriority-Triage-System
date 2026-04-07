package com.medipriority.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class VitalsRequest {

    @NotNull
    @Min(1)
    private Integer heartRate;

    @NotNull
    @Min(1)
    private Integer systolicBp;

    @NotNull
    @Min(1)
    private Integer diastolicBp;

    public Integer getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(Integer heartRate) {
        this.heartRate = heartRate;
    }

    public Integer getSystolicBp() {
        return systolicBp;
    }

    public void setSystolicBp(Integer systolicBp) {
        this.systolicBp = systolicBp;
    }

    public Integer getDiastolicBp() {
        return diastolicBp;
    }

    public void setDiastolicBp(Integer diastolicBp) {
        this.diastolicBp = diastolicBp;
    }
}
