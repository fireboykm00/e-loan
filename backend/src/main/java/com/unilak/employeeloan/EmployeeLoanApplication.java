package com.unilak.employeeloan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EmployeeLoanApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmployeeLoanApplication.class, args);
    }
}
