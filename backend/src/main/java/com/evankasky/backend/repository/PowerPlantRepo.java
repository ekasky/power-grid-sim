package com.evankasky.backend.repository;

import com.evankasky.backend.model.PowerPlant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PowerPlantRepo extends JpaRepository<PowerPlant, UUID> {

    boolean existsByCompany_IdAndPlantId(UUID companyId, String plantId);
    boolean existsByCompany_IdAndPlantIdAndIdNot(UUID companyId, String plantId, UUID excludedPowerPlantId);
    List<PowerPlant> findAllByCompany_Id(UUID companyId);
    List<PowerPlant> findAllByCompany_ShortName(String shortName);
    Optional<PowerPlant> findByCompany_IdAndId(UUID companyId, UUID powerPlantId);
    Optional<PowerPlant> findByIdAndCompany_Id(UUID powerPlantId, UUID companyId);


}
