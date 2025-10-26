package com.unilak.employeeloan.service;

import com.unilak.employeeloan.dto.RepaymentRequest;
import com.unilak.employeeloan.exception.ResourceNotFoundException;
import com.unilak.employeeloan.model.Accountant;
import com.unilak.employeeloan.model.LoanApplication;
import com.unilak.employeeloan.model.Repayment;
import com.unilak.employeeloan.repository.AccountantRepository;
import com.unilak.employeeloan.repository.LoanApplicationRepository;
import com.unilak.employeeloan.repository.RepaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepaymentService {

    private final RepaymentRepository repaymentRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final AccountantRepository accountantRepository;

    public List<Repayment> getAllRepayments() {
        return repaymentRepository.findAll();
    }

    public List<Repayment> getRepaymentsByLoanId(Long loanId) {
        return repaymentRepository.findByLoanApplicationLoanId(loanId);
    }

    public Repayment createRepayment(RepaymentRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Accountant accountant = accountantRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Accountant", "email", email));

        LoanApplication loan = loanApplicationRepository.findById(request.getLoanId())
                .orElseThrow(() -> new ResourceNotFoundException("LoanApplication", "id", request.getLoanId()));

        if (loan.getStatus() != LoanApplication.LoanStatus.APPROVED 
            && loan.getStatus() != LoanApplication.LoanStatus.COMPLETED) {
            throw new IllegalStateException("Cannot make payment for loan that is not approved");
        }

        BigDecimal currentBalance = loan.getOutstandingBalance();
        if (request.getAmountPaid().compareTo(currentBalance) > 0) {
            throw new IllegalArgumentException("Payment amount exceeds outstanding balance");
        }

        Repayment repayment = new Repayment();
        repayment.setLoanApplication(loan);
        repayment.setAccountant(accountant);
        repayment.setAmountPaid(request.getAmountPaid());
        repayment.setPaymentDate(LocalDate.now());
        repayment.setBalance(currentBalance.subtract(request.getAmountPaid()));

        Repayment savedRepayment = repaymentRepository.save(repayment);

        // Add repayment to loan's collection to maintain bidirectional relationship
        loan.getRepayments().add(savedRepayment);

        // Auto-complete loan if fully paid
        if (repayment.getBalance().compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanApplication.LoanStatus.COMPLETED);
        }
        
        // Save the loan to update status and maintain relationship
        loanApplicationRepository.save(loan);

        return savedRepayment;
    }
}
