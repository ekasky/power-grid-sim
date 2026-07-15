package com.evankasky.backend.repository;

import com.evankasky.backend.model.PowerCompany;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PowerCompanyRepo extends JpaRepository<PowerCompany, UUID> {

    boolean existsByShortName(String shortName);
    boolean existsByShortNameAndIdNot(String shortName, UUID id);
    Optional<PowerCompany> findByShortName(String shortName);

}
