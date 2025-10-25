package com.unilak.employeeloan.controller;

import com.unilak.employeeloan.model.LoanType;
import com.unilak.employeeloan.service.LoanTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan-types")
@RequiredArgsConstructor
public class LoanTypeController {

    private final LoanTypeService loanTypeService;

    @GetMapping
    public ResponseEntity<List<LoanType>> getAllLoanTypes() {
        return ResponseEntity.ok(loanTypeService.getAllLoanTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanType> getLoanTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(loanTypeService.getLoanTypeById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanType> createLoanType(@Valid @RequestBody LoanType loanType) {
        return ResponseEntity.ok(loanTypeService.createLoanType(loanType));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanType> updateLoanType(@PathVariable Long id, @Valid @RequestBody LoanType loanType) {
        return ResponseEntity.ok(loanTypeService.updateLoanType(id, loanType));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLoanType(@PathVariable Long id) {
        loanTypeService.deleteLoanType(id);
        return ResponseEntity.ok().build();
    }
}
