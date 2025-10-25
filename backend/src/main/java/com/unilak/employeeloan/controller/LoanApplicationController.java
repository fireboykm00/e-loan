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
    public ResponseEntity<List<LoanApplication>> getAllLoans() {
        return ResponseEntity.ok(loanApplicationService.getAllLoans());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanApplication>> getLoansByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(loanApplicationService.getLoansByUser(userId));
    }

    @GetMapping("/status/{status}")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanApplication> approveLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.approveLoan(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanApplication> rejectLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.rejectLoan(id));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanApplication> completeLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.completeLoan(id));
    }
}
