package com.unilak.employeeloan.controller;

import com.unilak.employeeloan.model.LoanApplication;
import com.unilak.employeeloan.service.LoanApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final LoanApplicationService loanApplicationService;

    @GetMapping("/outstanding")
    public ResponseEntity<Map<String, Object>> getOutstandingReport() {
        List<LoanApplication> approvedLoans = loanApplicationService.getLoansByStatus(LoanApplication.LoanStatus.APPROVED);
        
        BigDecimal totalOutstanding = approvedLoans.stream()
                .map(LoanApplication::getOutstandingBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> report = new HashMap<>();
        report.put("totalOutstandingLoans", approvedLoans.size());
        report.put("totalOutstandingAmount", totalOutstanding);
        report.put("loans", approvedLoans);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummaryReport() {
        List<LoanApplication> allLoans = loanApplicationService.getAllLoans();
        
        long pendingCount = allLoans.stream().filter(l -> l.getStatus() == LoanApplication.LoanStatus.PENDING).count();
        long approvedCount = allLoans.stream().filter(l -> l.getStatus() == LoanApplication.LoanStatus.APPROVED).count();
        long completedCount = allLoans.stream().filter(l -> l.getStatus() == LoanApplication.LoanStatus.COMPLETED).count();
        long rejectedCount = allLoans.stream().filter(l -> l.getStatus() == LoanApplication.LoanStatus.REJECTED).count();

        BigDecimal totalDisbursed = allLoans.stream()
                .filter(l -> l.getStatus() == LoanApplication.LoanStatus.APPROVED || l.getStatus() == LoanApplication.LoanStatus.COMPLETED)
                .map(LoanApplication::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalLoans", allLoans.size());
        summary.put("pendingLoans", pendingCount);
        summary.put("approvedLoans", approvedCount);
        summary.put("completedLoans", completedCount);
        summary.put("rejectedLoans", rejectedCount);
        summary.put("totalDisbursed", totalDisbursed);

        return ResponseEntity.ok(summary);
    }
}
