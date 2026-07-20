package com.evankasky.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("RESIDENTIAL")
public class ResidentialCustomer extends Customer {

    /* *****************************************************************************************************************
     *                                                  Constructors
     ***************************************************************************************************************** */

    protected ResidentialCustomer() { }

    public ResidentialCustomer(
            String accountNumber,
            String name,
            Location location
    ) {
        super(accountNumber, name, location);
    }

    /* *****************************************************************************************************************
     *                                            Customer Methods
     ***************************************************************************************************************** */

    @Override
    public CustomerType getCustomerType() {
        return CustomerType.RESIDENTIAL;
    }

}
