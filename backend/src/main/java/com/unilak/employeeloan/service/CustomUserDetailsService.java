package com.unilak.employeeloan.service;

import com.unilak.employeeloan.model.*;
import com.unilak.employeeloan.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;
    private final AdminRepository adminRepository;
    private final LoanOfficerRepository loanOfficerRepository;
    private final AccountantRepository accountantRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Check Employee
        Optional<Employee> employee = employeeRepository.findByEmail(email);
        if (employee.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    employee.get().getEmail(),
                    employee.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_EMPLOYEE"))
            );
        }

        // Check Admin
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    admin.get().getEmail(),
                    admin.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // Check LoanOfficer
        Optional<LoanOfficer> loanOfficer = loanOfficerRepository.findByEmail(email);
        if (loanOfficer.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    loanOfficer.get().getEmail(),
                    loanOfficer.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_LOAN_OFFICER"))
            );
        }

        // Check Accountant
        Optional<Accountant> accountant = accountantRepository.findByEmail(email);
        if (accountant.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    accountant.get().getEmail(),
                    accountant.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ACCOUNTANT"))
            );
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
