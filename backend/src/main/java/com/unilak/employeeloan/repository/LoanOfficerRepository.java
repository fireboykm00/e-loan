package com.unilak.employeeloan.repository;

import com.unilak.employeeloan.model.LoanOfficer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoanOfficerRepository extends JpaRepository<LoanOfficer, Long> {
    Optional<LoanOfficer> findByEmail(String email);
    boolean existsByEmail(String email);
}
