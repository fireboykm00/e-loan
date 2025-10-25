package com.unilak.employeeloan.repository;

import com.unilak.employeeloan.model.Repayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepaymentRepository extends JpaRepository<Repayment, Long> {
    List<Repayment> findByLoanApplicationLoanId(Long loanId);
}
