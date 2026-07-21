package com.evankasky.backend.repository;

import com.evankasky.backend.model.PowerSubstation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PowerSubstationRepo extends JpaRepository<PowerSubstation, UUID> {

    boolean existsByPowerPlant_IdAndSubstationId(UUID powerPlantId, String substationId);
    boolean existsByPowerPlant_IdAndSubstationIdAndIdNot(UUID powerPlantId, String substationId, UUID excludedSubstationId);
    List<PowerSubstation> findAllByPowerPlant_Id(UUID powerPlantId);
    List<PowerSubstation> findAllByPowerPlant_Company_Id(UUID companyId);
    long countByPowerPlant_Id(UUID powerPlantId);
    boolean existsByPowerPlant_Id(UUID powerPlantId);

}
