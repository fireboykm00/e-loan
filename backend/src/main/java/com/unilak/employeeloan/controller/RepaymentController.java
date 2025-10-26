package com.unilak.employeeloan.controller;

import com.unilak.employeeloan.dto.RepaymentRequest;
import com.unilak.employeeloan.model.Repayment;
import com.unilak.employeeloan.service.RepaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repayments")
@RequiredArgsConstructor
public class RepaymentController {

    private final RepaymentService repaymentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<List<Repayment>> getAllRepayments() {
        return ResponseEntity.ok(repaymentService.getAllRepayments());
    }

    @GetMapping("/loan/{loanId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT', 'LOAN_OFFICER')")
    public ResponseEntity<List<Repayment>> getRepaymentsByLoanId(@PathVariable Long loanId) {
        return ResponseEntity.ok(repaymentService.getRepaymentsByLoanId(loanId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<Repayment> createRepayment(@Valid @RequestBody RepaymentRequest request) {
        return ResponseEntity.ok(repaymentService.createRepayment(request));
    }
}
