package com.unilak.employeeloan.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "loan_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long loanId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "loan_type_id", nullable = false)
    private LoanType loanType;

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    private LoanStatus status = LoanStatus.PENDING;

    @NotNull
    private LocalDate applicationDate;

    private LocalDate approvedDate;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @OneToMany(mappedBy = "loanApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Repayment> repayments = new ArrayList<>();

    @Transient
    public BigDecimal getTotalPaid() {
        return repayments.stream()
                .map(Repayment::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transient
    public BigDecimal getOutstandingBalance() {
        return amount.subtract(getTotalPaid());
    }

    public enum LoanStatus {
        PENDING, APPROVED, REJECTED, COMPLETED
    }
}
