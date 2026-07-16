package com.evankasky.backend.controller;

import com.evankasky.backend.dto.transformer.TransformerResponse;
import com.evankasky.backend.mapper.TransformerMapper;
import com.evankasky.backend.model.Transformer;
import com.evankasky.backend.service.TransformerService;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/companies/{companyId}/plants/{powerPlantId}/transformers")
    public List<TransformerResponse> getAllPowerPlantsTransformers(
            @PathVariable UUID companyId,
            @PathVariable UUID powerPlantId
    ) {
        return transformerService.getAllPowerPlantsTransformers(companyId, powerPlantId)
                .stream()
                .map(transformerMapper::toResponse)
                .toList();
    }

    @GetMapping("/companies/{companyId}/plants/{powerPlantId}/substations/{powerSubstationId}/transformers")
    public List<TransformerResponse> getAllPowerSubstationsTransformers(
            @PathVariable UUID companyId,
            @PathVariable UUID powerPlantId,
            @PathVariable UUID powerSubstationId
    ) {
        return transformerService.getAllPowerSubstationTransformers(companyId, powerPlantId, powerSubstationId)
                .stream()
                .map(transformerMapper::toResponse)
                .toList();
    }

    @GetMapping(
            value = "/companies/{companyId}/plants/{powerPlantId}/substations/{powerSubstationId}/transformers",
            params = "transformerId"
    )
    public TransformerResponse getTransformerByTransformerId(
            @PathVariable UUID companyId,
            @PathVariable UUID powerPlantId,
            @PathVariable UUID powerSubstationId,
            @RequestParam String transformerId
    ) {
        Transformer transformer = transformerService.getTransformerByTransformerId(
                companyId,
                powerPlantId,
                powerSubstationId,
                transformerId
        );

        return transformerMapper.toResponse(transformer);
    }

}
