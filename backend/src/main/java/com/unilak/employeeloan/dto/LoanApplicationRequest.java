package com.unilak.employeeloan.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanApplicationRequest {
    @NotNull
    private Long loanTypeId;

    @NotNull
    @Positive
    private BigDecimal amount;

    private String remarks;
}
