package com.unilak.employeeloan.service;

import com.unilak.employeeloan.dto.LoanApplicationRequest;
import com.unilak.employeeloan.exception.ResourceNotFoundException;
import com.unilak.employeeloan.model.LoanApplication;
import com.unilak.employeeloan.model.LoanType;
import com.unilak.employeeloan.model.Employee;
import com.unilak.employeeloan.model.LoanOfficer;
import com.unilak.employeeloan.repository.EmployeeRepository;
import com.unilak.employeeloan.repository.LoanApplicationRepository;
import com.unilak.employeeloan.repository.LoanOfficerRepository;
import com.unilak.employeeloan.repository.LoanTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanTypeRepository loanTypeRepository;
    private final EmployeeRepository employeeRepository;
    private final LoanOfficerRepository loanOfficerRepository;

    public List<LoanApplication> getAllLoans() {
        return loanApplicationRepository.findAll();
    }

    public List<LoanApplication> getMyLoans() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return loanApplicationRepository.findByEmployeeId(employee.getId());
    }

    public List<LoanApplication> getLoansByEmployee(Long employeeId) {
        return loanApplicationRepository.findByEmployeeId(employeeId);
    }

    public List<LoanApplication> getLoansByStatus(LoanApplication.LoanStatus status) {
        return loanApplicationRepository.findByStatus(status);
    }

    public LoanApplication getLoanById(Long id) {
        return loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LoanApplication", "id", id));
    }

    public LoanApplication createLoanApplication(LoanApplicationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "email", email));

        LoanType loanType = loanTypeRepository.findById(request.getLoanTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("LoanType", "id", request.getLoanTypeId()));

        if (request.getAmount().compareTo(loanType.getMaxAmount()) > 0) {
            throw new IllegalArgumentException("Loan amount exceeds maximum allowed for this loan type");
        }

        LoanApplication loanApplication = new LoanApplication();
        loanApplication.setEmployee(employee);
        loanApplication.setLoanType(loanType);
        loanApplication.setAmount(request.getAmount());
        loanApplication.setRemarks(request.getRemarks());
        loanApplication.setApplicationDate(LocalDate.now());
        loanApplication.setStatus(LoanApplication.LoanStatus.PENDING);

        return loanApplicationRepository.save(loanApplication);
    }

    public LoanApplication approveLoan(Long loanId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        LoanOfficer loanOfficer = loanOfficerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("LoanOfficer", "email", email));

        LoanApplication loan = getLoanById(loanId);
        
        // Validation: Can only approve PENDING loans
        if (loan.getStatus() != LoanApplication.LoanStatus.PENDING) {
            throw new IllegalStateException("Can only approve loans with PENDING status. Current status: " + loan.getStatus());
        }
        
        loan.setStatus(LoanApplication.LoanStatus.APPROVED);
        loan.setApprovedDate(LocalDate.now());
        loan.setLoanOfficer(loanOfficer);
        return loanApplicationRepository.save(loan);
    }

    public LoanApplication rejectLoan(Long loanId, String rejectionReason) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        LoanOfficer loanOfficer = loanOfficerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("LoanOfficer", "email", email));

        LoanApplication loan = getLoanById(loanId);
        
        // Validation: Can only reject PENDING loans
        if (loan.getStatus() != LoanApplication.LoanStatus.PENDING) {
            throw new IllegalStateException("Can only reject loans with PENDING status. Current status: " + loan.getStatus());
        }
        
        loan.setStatus(LoanApplication.LoanStatus.REJECTED);
        loan.setLoanOfficer(loanOfficer);
        loan.setRejectionReason(rejectionReason != null ? rejectionReason : "No reason provided");
        return loanApplicationRepository.save(loan);
    }

    public LoanApplication completeLoan(Long loanId) {
        LoanApplication loan = getLoanById(loanId);
        if (loan.getOutstandingBalance().compareTo(java.math.BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanApplication.LoanStatus.COMPLETED);
            return loanApplicationRepository.save(loan);
        }
        throw new IllegalStateException("Cannot complete loan with outstanding balance");
    }
}
