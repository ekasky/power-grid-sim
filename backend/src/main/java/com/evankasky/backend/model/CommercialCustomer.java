package com.evankasky.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("COMMERCIAL")
public class CommercialCustomer extends Customer {

    /* *****************************************************************************************************************
     *                                                  Constructors
     ***************************************************************************************************************** */

    protected CommercialCustomer() { }

    public CommercialCustomer(
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
        return CustomerType.COMMERCIAL;
    }
}
