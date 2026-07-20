package com.evankasky.backend.repository;

import com.evankasky.backend.model.Transformer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransformerRepo extends JpaRepository<Transformer, UUID> {

    boolean existsByPowerSubstation_IdAndTransformerId(UUID powerSubstationId, String transformerId);
    boolean existsByPowerSubstation_IdAndTransformerIdAndIdNot(UUID powerSubstationId, String transformerId, UUID excludedTransformerId);
    List<Transformer> findAllByPowerSubstation_Id(UUID powerSubstationId);
    List<Transformer> findAllByPowerSubstation_PowerPlant_Company_Id(UUID companyId);
    List<Transformer> findAllByPowerSubstation_PowerPlant_Id(UUID powerPlantId);
    long countByPowerSubstation_Id(UUID powerSubstationId);

}
