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
@Table(name = "accountants")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Accountant extends UserBase {
    
    @OneToMany(mappedBy = "accountant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Repayment> processedRepayments = new ArrayList<>();
}
