package com.unilak.employeeloan.service;

import com.unilak.employeeloan.dto.RepaymentRequest;
import com.unilak.employeeloan.model.LoanApplication;
import com.unilak.employeeloan.model.Repayment;
import com.unilak.employeeloan.repository.LoanApplicationRepository;
import com.unilak.employeeloan.repository.RepaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepaymentService {

    private final RepaymentRepository repaymentRepository;
    private final LoanApplicationRepository loanApplicationRepository;

    public List<Repayment> getAllRepayments() {
        return repaymentRepository.findAll();
    }

    public List<Repayment> getRepaymentsByLoanId(Long loanId) {
        return repaymentRepository.findByLoanApplicationLoanId(loanId);
    }

    public Repayment createRepayment(RepaymentRequest request) {
        LoanApplication loan = loanApplicationRepository.findById(request.getLoanId())
                .orElseThrow(() -> new RuntimeException("Loan application not found"));

        if (loan.getStatus() != LoanApplication.LoanStatus.APPROVED 
            && loan.getStatus() != LoanApplication.LoanStatus.COMPLETED) {
            throw new RuntimeException("Cannot make payment for loan that is not approved");
        }

        BigDecimal currentBalance = loan.getOutstandingBalance();
        if (request.getAmountPaid().compareTo(currentBalance) > 0) {
            throw new RuntimeException("Payment amount exceeds outstanding balance");
        }

        Repayment repayment = new Repayment();
        repayment.setLoanApplication(loan);
        repayment.setAmountPaid(request.getAmountPaid());
        repayment.setPaymentDate(LocalDate.now());
        repayment.setBalance(currentBalance.subtract(request.getAmountPaid()));

        Repayment savedRepayment = repaymentRepository.save(repayment);

        // Auto-complete loan if fully paid
        if (repayment.getBalance().compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanApplication.LoanStatus.COMPLETED);
            loanApplicationRepository.save(loan);
        }

        return savedRepayment;
    }
}
