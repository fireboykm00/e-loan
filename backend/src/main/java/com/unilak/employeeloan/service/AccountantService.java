package com.unilak.employeeloan.service;

import com.unilak.employeeloan.model.Accountant;
import com.unilak.employeeloan.repository.AccountantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountantService {

    private final AccountantRepository accountantRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Accountant> getAllAccountants() {
        return accountantRepository.findAll();
    }

    public Accountant getAccountantById(Long id) {
        return accountantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accountant not found"));
    }

    public Accountant getAccountantByEmail(String email) {
        return accountantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Accountant not found"));
    }

    public Accountant createAccountant(Accountant accountant) {
        if (accountantRepository.existsByEmail(accountant.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        accountant.setPassword(passwordEncoder.encode(accountant.getPassword()));
        return accountantRepository.save(accountant);
    }

    public Accountant updateAccountant(Long id, Accountant updatedAccountant) {
        Accountant accountant = getAccountantById(id);
        accountant.setName(updatedAccountant.getName());
        if (updatedAccountant.getPassword() != null && !updatedAccountant.getPassword().isEmpty()) {
            accountant.setPassword(passwordEncoder.encode(updatedAccountant.getPassword()));
        }
        return accountantRepository.save(accountant);
    }

    public void deleteAccountant(Long id) {
        accountantRepository.deleteById(id);
    }
}
