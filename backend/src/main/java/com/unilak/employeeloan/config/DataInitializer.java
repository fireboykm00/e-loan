package com.unilak.employeeloan.config;

import com.unilak.employeeloan.model.LoanType;
import com.unilak.employeeloan.model.User;
import com.unilak.employeeloan.repository.LoanTypeRepository;
import com.unilak.employeeloan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LoanTypeRepository loanTypeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeLoanTypes();
        initializeUsers();
    }

    private void initializeLoanTypes() {
        if (loanTypeRepository.count() == 0) {
            log.info("Initializing loan types...");

            LoanType salaryAdvance = new LoanType();
            salaryAdvance.setName("Salary Advance");
            salaryAdvance.setDescription("Short-term advance on monthly salary");
            salaryAdvance.setMaxAmount(new BigDecimal("500000"));
            loanTypeRepository.save(salaryAdvance);

            LoanType emergency = new LoanType();
            emergency.setName("Emergency Loan");
            emergency.setDescription("For urgent and unexpected expenses");
            emergency.setMaxAmount(new BigDecimal("1000000"));
            loanTypeRepository.save(emergency);

            LoanType education = new LoanType();
            education.setName("Education Loan");
            education.setDescription("For educational purposes and professional development");
            education.setMaxAmount(new BigDecimal("2000000"));
            loanTypeRepository.save(education);

            LoanType personal = new LoanType();
            personal.setName("Personal Loan");
            personal.setDescription("General purpose personal loan");
            personal.setMaxAmount(new BigDecimal("1500000"));
            loanTypeRepository.save(personal);

            log.info("Loan types initialized successfully");
        }
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            log.info("Initializing default users...");

            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@unilak.ac.rw");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);

            User employee1 = new User();
            employee1.setName("John Doe");
            employee1.setEmail("john.doe@unilak.ac.rw");
            employee1.setPassword(passwordEncoder.encode("employee123"));
            employee1.setRole(User.Role.EMPLOYEE);
            userRepository.save(employee1);

            User employee2 = new User();
            employee2.setName("Jane Smith");
            employee2.setEmail("jane.smith@unilak.ac.rw");
            employee2.setPassword(passwordEncoder.encode("employee123"));
            employee2.setRole(User.Role.EMPLOYEE);
            userRepository.save(employee2);

            log.info("Default users initialized successfully");
            log.info("Admin credentials - Email: admin@unilak.ac.rw, Password: admin123");
            log.info("Employee credentials - Email: john.doe@unilak.ac.rw, Password: employee123");
        }
    }
}
