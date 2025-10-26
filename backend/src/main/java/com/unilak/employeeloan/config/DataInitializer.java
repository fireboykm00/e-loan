package com.unilak.employeeloan.config;

import com.unilak.employeeloan.model.*;
import com.unilak.employeeloan.repository.*;
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

    private final EmployeeRepository employeeRepository;
    private final AdminRepository adminRepository;
    private final LoanOfficerRepository loanOfficerRepository;
    private final AccountantRepository accountantRepository;
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
            salaryAdvance.setInterestRate(new BigDecimal("5.0"));
            loanTypeRepository.save(salaryAdvance);

            LoanType emergency = new LoanType();
            emergency.setName("Emergency Loan");
            emergency.setDescription("For urgent and unexpected expenses");
            emergency.setMaxAmount(new BigDecimal("1000000"));
            emergency.setInterestRate(new BigDecimal("7.5"));
            loanTypeRepository.save(emergency);

            LoanType education = new LoanType();
            education.setName("Education Loan");
            education.setDescription("For educational purposes and professional development");
            education.setMaxAmount(new BigDecimal("2000000"));
            education.setInterestRate(new BigDecimal("6.0"));
            loanTypeRepository.save(education);

            LoanType personal = new LoanType();
            personal.setName("Personal Loan");
            personal.setDescription("General purpose personal loan");
            personal.setMaxAmount(new BigDecimal("1500000"));
            personal.setInterestRate(new BigDecimal("8.0"));
            loanTypeRepository.save(personal);

            log.info("Loan types initialized successfully");
        }
    }

    private void initializeUsers() {
        if (adminRepository.count() == 0 && employeeRepository.count() == 0) {
            log.info("Initializing default users...");

            // Create Admin
            Admin admin = new Admin();
            admin.setName("System Admin");
            admin.setEmail("admin@company.com");
            admin.setPassword(passwordEncoder.encode("pass123"));
            admin.setAdminRole("Super Admin");
            adminRepository.save(admin);

            // Create Employees
            Employee employee1 = new Employee();
            employee1.setName("John Doe");
            employee1.setEmail("employee@company.com");
            employee1.setPassword(passwordEncoder.encode("pass123"));
            employee1.setDepartment("IT Department");
            employeeRepository.save(employee1);

            Employee employee2 = new Employee();
            employee2.setName("Jane Smith");
            employee2.setEmail("jane.smith@company.com");
            employee2.setPassword(passwordEncoder.encode("pass123"));
            employee2.setDepartment("HR Department");
            employeeRepository.save(employee2);

            // Create Loan Officer
            LoanOfficer loanOfficer = new LoanOfficer();
            loanOfficer.setName("Michael Johnson");
            loanOfficer.setEmail("officer@company.com");
            loanOfficer.setPassword(passwordEncoder.encode("pass123"));
            loanOfficerRepository.save(loanOfficer);

            // Create Accountant
            Accountant accountant = new Accountant();
            accountant.setName("Sarah Williams");
            accountant.setEmail("accountant@company.com");
            accountant.setPassword(passwordEncoder.encode("pass123"));
            accountantRepository.save(accountant);

            log.info("Default users initialized successfully");
            log.info("👤 Employee: employee@company.com / pass123");
            log.info("💼 Loan Officer: officer@company.com / pass123");
            log.info("📊 Accountant: accountant@company.com / pass123");
            log.info("🔧 Admin: admin@company.com / pass123");
        }
    }
}
