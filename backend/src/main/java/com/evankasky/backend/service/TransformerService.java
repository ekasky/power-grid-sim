package com.evankasky.backend.service;

import com.evankasky.backend.repository.TransformerRepo;
import org.springframework.stereotype.Service;

@Service
public class TransformerService {

    private TransformerRepo transformerRepo;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public TransformerService(TransformerRepo transformerRepo) {
        this.transformerRepo = transformerRepo;
    }

    /* *****************************************************************************************************************
     *                                       Transformer Service Methods
     ***************************************************************************************************************** */

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

}
