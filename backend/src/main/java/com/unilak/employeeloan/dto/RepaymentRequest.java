package com.unilak.employeeloan.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RepaymentRequest {
    @NotNull
    private Long loanId;

    @NotNull
    @Positive
    private BigDecimal amountPaid;
}
