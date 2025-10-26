package com.unilak.employeeloan.service;

import com.unilak.employeeloan.exception.ResourceNotFoundException;
import com.unilak.employeeloan.model.LoanType;
import com.unilak.employeeloan.repository.LoanTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanTypeService {

    private final LoanTypeRepository loanTypeRepository;

    public List<LoanType> getAllLoanTypes() {
        return loanTypeRepository.findAll();
    }

    public LoanType getLoanTypeById(Long id) {
        return loanTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LoanType", "id", id));
    }

    public LoanType createLoanType(LoanType loanType) {
        return loanTypeRepository.save(loanType);
    }

    public LoanType updateLoanType(Long id, LoanType loanType) {
        LoanType existing = getLoanTypeById(id);
        existing.setName(loanType.getName());
        existing.setDescription(loanType.getDescription());
        existing.setMaxAmount(loanType.getMaxAmount());
        return loanTypeRepository.save(existing);
    }

    public void deleteLoanType(Long id) {
        loanTypeRepository.deleteById(id);
    }
}
