package com.unilak.employeeloan.controller;

import com.unilak.employeeloan.model.LoanOfficer;
import com.unilak.employeeloan.service.LoanOfficerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan-officers")
@RequiredArgsConstructor
public class LoanOfficerController {

    private final LoanOfficerService loanOfficerService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LoanOfficer>> getAllLoanOfficers() {
        return ResponseEntity.ok(loanOfficerService.getAllLoanOfficers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOAN_OFFICER')")
    public ResponseEntity<LoanOfficer> getLoanOfficerById(@PathVariable Long id) {
        return ResponseEntity.ok(loanOfficerService.getLoanOfficerById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOAN_OFFICER')")
    public ResponseEntity<LoanOfficer> updateLoanOfficer(@PathVariable Long id, @Valid @RequestBody LoanOfficer loanOfficer) {
        return ResponseEntity.ok(loanOfficerService.updateLoanOfficer(id, loanOfficer));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLoanOfficer(@PathVariable Long id) {
        loanOfficerService.deleteLoanOfficer(id);
        return ResponseEntity.noContent().build();
    }
}
