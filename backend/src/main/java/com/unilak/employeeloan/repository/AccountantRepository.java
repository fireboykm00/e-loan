package com.unilak.employeeloan.repository;

import com.unilak.employeeloan.model.Accountant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountantRepository extends JpaRepository<Accountant, Long> {
    Optional<Accountant> findByEmail(String email);
    boolean existsByEmail(String email);
}
