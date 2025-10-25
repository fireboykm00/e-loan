package com.unilak.employeeloan.service;

import com.unilak.employeeloan.dto.LoanApplicationRequest;
import com.unilak.employeeloan.model.LoanApplication;
import com.unilak.employeeloan.model.LoanType;
import com.unilak.employeeloan.model.User;
import com.unilak.employeeloan.repository.LoanApplicationRepository;
import com.unilak.employeeloan.repository.LoanTypeRepository;
import com.unilak.employeeloan.repository.UserRepository;
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
    private final UserRepository userRepository;

    public List<LoanApplication> getAllLoans() {
        return loanApplicationRepository.findAll();
    }

    public List<LoanApplication> getLoansByUser(Long userId) {
        return loanApplicationRepository.findByUserId(userId);
    }

    public List<LoanApplication> getLoansByStatus(LoanApplication.LoanStatus status) {
        return loanApplicationRepository.findByStatus(status);
    }

    public LoanApplication getLoanById(Long id) {
        return loanApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan application not found"));
    }

    public LoanApplication createLoanApplication(LoanApplicationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LoanType loanType = loanTypeRepository.findById(request.getLoanTypeId())
                .orElseThrow(() -> new RuntimeException("Loan type not found"));

        if (request.getAmount().compareTo(loanType.getMaxAmount()) > 0) {
            throw new RuntimeException("Loan amount exceeds maximum allowed for this loan type");
        }

        LoanApplication loanApplication = new LoanApplication();
        loanApplication.setUser(user);
        loanApplication.setLoanType(loanType);
        loanApplication.setAmount(request.getAmount());
        loanApplication.setRemarks(request.getRemarks());
        loanApplication.setApplicationDate(LocalDate.now());
        loanApplication.setStatus(LoanApplication.LoanStatus.PENDING);

        return loanApplicationRepository.save(loanApplication);
    }

    public LoanApplication approveLoan(Long loanId) {
        LoanApplication loan = getLoanById(loanId);
        loan.setStatus(LoanApplication.LoanStatus.APPROVED);
        loan.setApprovedDate(LocalDate.now());
        return loanApplicationRepository.save(loan);
    }

    public LoanApplication rejectLoan(Long loanId) {
        LoanApplication loan = getLoanById(loanId);
        loan.setStatus(LoanApplication.LoanStatus.REJECTED);
        return loanApplicationRepository.save(loan);
    }

    public LoanApplication completeLoan(Long loanId) {
        LoanApplication loan = getLoanById(loanId);
        if (loan.getOutstandingBalance().compareTo(java.math.BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanApplication.LoanStatus.COMPLETED);
            return loanApplicationRepository.save(loan);
        }
        throw new RuntimeException("Cannot complete loan with outstanding balance");
    }
}
