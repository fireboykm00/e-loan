package com.unilak.employeeloan.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "repayments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Repayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long repaymentId;

    @ManyToOne
    @JoinColumn(name = "loan_id", nullable = false)
    @JsonIgnoreProperties({"repayments", "user", "loanType"})
    private LoanApplication loanApplication;

    @NotNull
    @Positive
    private BigDecimal amountPaid;

    @NotNull
    private LocalDate paymentDate;

    @NotNull
    private BigDecimal balance;
}
