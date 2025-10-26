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
            admin.setEmail("admin@unilak.ac.rw");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setAdminRole("Super Admin");
            adminRepository.save(admin);

            // Create Employees
            Employee employee1 = new Employee();
            employee1.setName("John Doe");
            employee1.setEmail("john.doe@unilak.ac.rw");
            employee1.setPassword(passwordEncoder.encode("employee123"));
            employee1.setDepartment("IT Department");
            employeeRepository.save(employee1);

            Employee employee2 = new Employee();
            employee2.setName("Jane Smith");
            employee2.setEmail("jane.smith@unilak.ac.rw");
            employee2.setPassword(passwordEncoder.encode("employee123"));
            employee2.setDepartment("HR Department");
            employeeRepository.save(employee2);

            // Create Loan Officer
            LoanOfficer loanOfficer = new LoanOfficer();
            loanOfficer.setName("Michael Johnson");
            loanOfficer.setEmail("loan.officer@unilak.ac.rw");
            loanOfficer.setPassword(passwordEncoder.encode("officer123"));
            loanOfficerRepository.save(loanOfficer);

            // Create Accountant
            Accountant accountant = new Accountant();
            accountant.setName("Sarah Williams");
            accountant.setEmail("accountant@unilak.ac.rw");
            accountant.setPassword(passwordEncoder.encode("accountant123"));
            accountantRepository.save(accountant);

            log.info("Default users initialized successfully");
            log.info("Admin credentials - Email: admin@unilak.ac.rw, Password: admin123");
            log.info("Employee credentials - Email: john.doe@unilak.ac.rw, Password: employee123");
            log.info("Loan Officer credentials - Email: loan.officer@unilak.ac.rw, Password: officer123");
            log.info("Accountant credentials - Email: accountant@unilak.ac.rw, Password: accountant123");
        }
    }
}
