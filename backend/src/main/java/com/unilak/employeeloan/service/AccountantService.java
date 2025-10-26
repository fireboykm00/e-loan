package com.unilak.employeeloan.service;

import com.unilak.employeeloan.exception.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Accountant", "id", id));
    }

    public Accountant getAccountantByEmail(String email) {
        return accountantRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Accountant", "email", email));
    }

    public Accountant createAccountant(Accountant accountant) {
        if (accountantRepository.existsByEmail(accountant.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
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
