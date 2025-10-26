package com.unilak.employeeloan.service;

import com.unilak.employeeloan.config.JwtUtil;
import com.unilak.employeeloan.dto.LoginRequest;
import com.unilak.employeeloan.dto.LoginResponse;
import com.unilak.employeeloan.model.*;
import com.unilak.employeeloan.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UnifiedAuthService {

    private final EmployeeRepository employeeRepository;
    private final AdminRepository adminRepository;
    private final LoanOfficerRepository loanOfficerRepository;
    private final AccountantRepository accountantRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Check which user type exists with this email
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            Employee employee = employeeRepository.findByEmail(request.getEmail()).get();
            String token = jwtUtil.generateToken(employee.getEmail());
            return new LoginResponse(token, employee.getEmail(), employee.getName(), "EMPLOYEE", employee.getId());
        }
        
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            Admin admin = adminRepository.findByEmail(request.getEmail()).get();
            String token = jwtUtil.generateToken(admin.getEmail());
            return new LoginResponse(token, admin.getEmail(), admin.getName(), "ADMIN", admin.getId());
        }
        
        if (loanOfficerRepository.findByEmail(request.getEmail()).isPresent()) {
            LoanOfficer loanOfficer = loanOfficerRepository.findByEmail(request.getEmail()).get();
            String token = jwtUtil.generateToken(loanOfficer.getEmail());
            return new LoginResponse(token, loanOfficer.getEmail(), loanOfficer.getName(), "LOAN_OFFICER", loanOfficer.getId());
        }
        
        if (accountantRepository.findByEmail(request.getEmail()).isPresent()) {
            Accountant accountant = accountantRepository.findByEmail(request.getEmail()).get();
            String token = jwtUtil.generateToken(accountant.getEmail());
            return new LoginResponse(token, accountant.getEmail(), accountant.getName(), "ACCOUNTANT", accountant.getId());
        }

        throw new RuntimeException("User not found");
    }

    public String getUserRole(String email) {
        if (employeeRepository.findByEmail(email).isPresent()) {
            return "EMPLOYEE";
        } else if (adminRepository.findByEmail(email).isPresent()) {
            return "ADMIN";
        } else if (loanOfficerRepository.findByEmail(email).isPresent()) {
            return "LOAN_OFFICER";
        } else if (accountantRepository.findByEmail(email).isPresent()) {
            return "ACCOUNTANT";
        }
        throw new RuntimeException("User not found");
    }
}
