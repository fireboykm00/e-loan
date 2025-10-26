package com.unilak.employeeloan.controller;

import com.unilak.employeeloan.model.Accountant;
import com.unilak.employeeloan.service.AccountantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accountants")
@RequiredArgsConstructor
public class AccountantController {

    private final AccountantService accountantService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Accountant>> getAllAccountants() {
        return ResponseEntity.ok(accountantService.getAllAccountants());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<Accountant> getAccountantById(@PathVariable Long id) {
        return ResponseEntity.ok(accountantService.getAccountantById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<Accountant> updateAccountant(@PathVariable Long id, @Valid @RequestBody Accountant accountant) {
        return ResponseEntity.ok(accountantService.updateAccountant(id, accountant));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAccountant(@PathVariable Long id) {
        accountantService.deleteAccountant(id);
        return ResponseEntity.noContent().build();
    }
}
