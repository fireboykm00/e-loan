package com.unilak.employeeloan.controller;

import com.unilak.employeeloan.dto.LoanApplicationRequest;
import com.unilak.employeeloan.model.LoanApplication;
import com.unilak.employeeloan.service.LoanApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LOAN_OFFICER')")
    public ResponseEntity<List<LoanApplication>> getAllLoans() {
        return ResponseEntity.ok(loanApplicationService.getAllLoans());
    }

    @GetMapping("/my-loans")
    public ResponseEntity<List<LoanApplication>> getMyLoans() {
        return ResponseEntity.ok(loanApplicationService.getMyLoans());
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOAN_OFFICER')")
    public ResponseEntity<List<LoanApplication>> getLoansByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(loanApplicationService.getLoansByEmployee(employeeId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOAN_OFFICER', 'ACCOUNTANT')")
    public ResponseEntity<List<LoanApplication>> getLoansByStatus(@PathVariable LoanApplication.LoanStatus status) {
        return ResponseEntity.ok(loanApplicationService.getLoansByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanApplication> getLoanById(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.getLoanById(id));
    }

    @PostMapping
    public ResponseEntity<LoanApplication> createLoanApplication(@Valid @RequestBody LoanApplicationRequest request) {
        return ResponseEntity.ok(loanApplicationService.createLoanApplication(request));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOAN_OFFICER')")
    public ResponseEntity<LoanApplication> approveLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.approveLoan(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOAN_OFFICER')")
    public ResponseEntity<LoanApplication> rejectLoan(@PathVariable Long id, @RequestBody(required = false) String remarks) {
        return ResponseEntity.ok(loanApplicationService.rejectLoan(id, remarks));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<LoanApplication> completeLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.completeLoan(id));
    }
}
