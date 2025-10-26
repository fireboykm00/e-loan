package com.unilak.employeeloan.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "loan_officers")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class LoanOfficer extends UserBase {
    
    @OneToMany(mappedBy = "loanOfficer", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<LoanApplication> processedApplications = new ArrayList<>();
}
