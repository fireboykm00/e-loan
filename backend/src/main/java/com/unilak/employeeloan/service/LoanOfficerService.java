package com.unilak.employeeloan.service;

import com.unilak.employeeloan.model.LoanOfficer;
import com.unilak.employeeloan.repository.LoanOfficerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanOfficerService {

    private final LoanOfficerRepository loanOfficerRepository;
    private final PasswordEncoder passwordEncoder;

    public List<LoanOfficer> getAllLoanOfficers() {
        return loanOfficerRepository.findAll();
    }

    public LoanOfficer getLoanOfficerById(Long id) {
        return loanOfficerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan Officer not found"));
    }

    public LoanOfficer getLoanOfficerByEmail(String email) {
        return loanOfficerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Loan Officer not found"));
    }

    public LoanOfficer createLoanOfficer(LoanOfficer loanOfficer) {
        if (loanOfficerRepository.existsByEmail(loanOfficer.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        loanOfficer.setPassword(passwordEncoder.encode(loanOfficer.getPassword()));
        return loanOfficerRepository.save(loanOfficer);
    }

    public LoanOfficer updateLoanOfficer(Long id, LoanOfficer updatedLoanOfficer) {
        LoanOfficer loanOfficer = getLoanOfficerById(id);
        loanOfficer.setName(updatedLoanOfficer.getName());
        if (updatedLoanOfficer.getPassword() != null && !updatedLoanOfficer.getPassword().isEmpty()) {
            loanOfficer.setPassword(passwordEncoder.encode(updatedLoanOfficer.getPassword()));
        }
        return loanOfficerRepository.save(loanOfficer);
    }

    public void deleteLoanOfficer(Long id) {
        loanOfficerRepository.deleteById(id);
    }
}
