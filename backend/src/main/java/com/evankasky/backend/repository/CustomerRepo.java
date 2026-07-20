package com.evankasky.backend.repository;

import com.evankasky.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepo extends JpaRepository<Customer, UUID> {

    boolean existsByAccountNumber(String accountNumber);
    boolean existsByAccountNumberAndIdNot(String accountNumber, UUID customerId);
    List<Customer> findAllByTransformer_PowerSubstation_PowerPlant_Company_Id(UUID powerPlantId);
    long countByTransformer_id(UUID transformerId);

}
