package com.unilak.employeeloan.controller;

import com.unilak.employeeloan.dto.LoginRequest;
import com.unilak.employeeloan.dto.LoginResponse;
import com.unilak.employeeloan.model.*;
import com.unilak.employeeloan.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UnifiedAuthService unifiedAuthService;
    private final EmployeeService employeeService;
    private final AdminService adminService;
    private final LoanOfficerService loanOfficerService;
    private final AccountantService accountantService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(unifiedAuthService.login(request));
    }

    @PostMapping("/register/employee")
    public ResponseEntity<Employee> registerEmployee(@Valid @RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<Admin> registerAdmin(@Valid @RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }

    @PostMapping("/register/loan-officer")
    public ResponseEntity<LoanOfficer> registerLoanOfficer(@Valid @RequestBody LoanOfficer loanOfficer) {
        return ResponseEntity.ok(loanOfficerService.createLoanOfficer(loanOfficer));
    }

    @PostMapping("/register/accountant")
    public ResponseEntity<Accountant> registerAccountant(@Valid @RequestBody Accountant accountant) {
        return ResponseEntity.ok(accountantService.createAccountant(accountant));
    }
}
