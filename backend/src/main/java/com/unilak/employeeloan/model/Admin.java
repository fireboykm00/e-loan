package com.unilak.employeeloan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admins")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends UserBase {
    
    @Column(name = "role")
    private String adminRole;  // e.g., "Super Admin", "System Admin", etc.
}
