package com.evankasky.backend.controller;

import com.evankasky.backend.dto.transformer.TransformerResponse;
import com.evankasky.backend.mapper.TransformerMapper;
import com.evankasky.backend.service.TransformerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class TransformerController {

    private final TransformerService transformerService;
    private final TransformerMapper transformerMapper;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    public TransformerController(TransformerService transformerService, TransformerMapper transformerMapper) {
        this.transformerService = transformerService;
        this.transformerMapper = transformerMapper;
    }

    /* *****************************************************************************************************************
     *                                      Transformer Controller Methods
     ***************************************************************************************************************** */

    @GetMapping("/transformers")
    public List<TransformerResponse> getAllTransformers() {
        return transformerService.getAllTransformers()
                .stream()
                .map(transformerMapper::toResponse)
                .toList();
    }

    @GetMapping("/companies/{companyId}/transformers")
    public List<TransformerResponse> getAllPowerCompaniesTransformers(
            @PathVariable UUID companyId
    ) {
        return transformerService.getAllPowerCompaniesTransformers(companyId)
                .stream()
                .map(transformerMapper::toResponse)
                .toList();
    }

}
