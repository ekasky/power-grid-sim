package com.evankasky.backend.controller;

import com.evankasky.backend.dto.CountResponse;
import com.evankasky.backend.dto.transformer.CreateTransformerRequest;
import com.evankasky.backend.dto.transformer.TransformerResponse;
import com.evankasky.backend.dto.transformer.UpdateTransformerRequest;
import com.evankasky.backend.mapper.TransformerMapper;
import com.evankasky.backend.model.Transformer;
import com.evankasky.backend.service.TransformerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/transformers/count")
    public CountResponse getTransformerCount() {
        long count = transformerService.getTransformerCount();
        return new CountResponse(count);
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

    @GetMapping("/plants/{powerPlantId}/transformers")
    public List<TransformerResponse> getAllPowerPlantsTransformers(
            @PathVariable UUID powerPlantId
    ) {
        return transformerService.getAllPowerPlantsTransformers(powerPlantId)
                .stream()
                .map(transformerMapper::toResponse)
                .toList();
    }

    @GetMapping("/substations/{powerSubstationId}/transformers")
    public List<TransformerResponse> getAllPowerSubstationsTransformers(
            @PathVariable UUID powerSubstationId
    ) {
        return transformerService.getAllPowerSubstationTransformers(powerSubstationId)
                .stream()
                .map(transformerMapper::toResponse)
                .toList();
    }


    @PostMapping("/substations/{powerSubstationId}/transformers")
    @ResponseStatus(HttpStatus.CREATED)
    public TransformerResponse createTransformer(
            @PathVariable UUID powerSubstationId,
            @Valid @RequestBody CreateTransformerRequest request
    ) {

        Transformer transformer = transformerService.createTransformer(powerSubstationId, request);
        return transformerMapper.toResponse(transformer);

    }

    @PatchMapping("/transformers/{transformerId}")
    public TransformerResponse updateTransformer(
            @PathVariable UUID transformerId,
            @Valid @RequestBody UpdateTransformerRequest request
    ) {

        Transformer transformer = transformerService.updateTransformer(
                transformerId,
                request
        );

        return transformerMapper.toResponse(transformer);

    }

    @DeleteMapping("/transformers/{transformerId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransformer(
            @PathVariable UUID transformerId
    ) {
        transformerService.deleteTransformer(
                transformerId
        );
    }

}
