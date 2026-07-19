package com.evankasky.backend.exception;

import com.evankasky.backend.dto.exception.PowerGridSimulationExceptionApiResponse;
import com.evankasky.backend.exception.powercompany.PowerCompanyExistsException;
import com.evankasky.backend.exception.powercompany.PowerCompanyNotFoundException;
import com.evankasky.backend.exception.powerplant.PowerPlantExistsException;
import com.evankasky.backend.exception.powerplant.PowerPlantNotFoundException;
import com.evankasky.backend.exception.powersubstation.PowerSubstationExistsException;
import com.evankasky.backend.exception.powersubstation.PowerSubstationNotFoundException;
import com.evankasky.backend.exception.transformer.TransformerExistsException;
import com.evankasky.backend.exception.transformer.TransformerNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PowerCompanyExistsException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handlePowerCompanyExistsException(
            PowerCompanyExistsException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()
        );
    }

    @ExceptionHandler(PowerCompanyNotFoundException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handlePowerCompanyNotFoundException(
            PowerCompanyNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()
        );
    }

    @ExceptionHandler(PowerPlantExistsException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handlePowerPlantExistsExceptionException(
            PowerPlantExistsException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()

        );
    }

    @ExceptionHandler(PowerPlantNotFoundException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handlePowerPlantNotFoundException(
            PowerPlantNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()
        );
    }

    @ExceptionHandler(PowerSubstationExistsException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handlePowerSubstationExistsException(
            PowerSubstationExistsException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()
        );
    }

    @ExceptionHandler(PowerSubstationNotFoundException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handlePowerSubstationNotFoundException(
            PowerSubstationNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()
        );
    }

    @ExceptionHandler(TransformerExistsException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handleTransformerExistsException(
            TransformerExistsException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()
        );
    }

    @ExceptionHandler(TransformerNotFoundException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handleTransformerNotFoundException(
            TransformerNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()
        );
    }

    @ExceptionHandler(PowerGridSimulationLogicalException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handleLogicalException(
            PowerGridSimulationLogicalException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handleValidationErrors(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Request validation failed",
                request.getRequestURI(),
                errors
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<PowerGridSimulationExceptionApiResponse> handleInvalidArgument(
            IllegalArgumentException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request.getRequestURI(),
                Map.of()
        );
    }

    /* *****************************************************************************************************************
     *                                              Helper Methods
     ***************************************************************************************************************** */

    private ResponseEntity<PowerGridSimulationExceptionApiResponse> buildResponse(
            HttpStatus status,
            String message,
            String path,
            Map<String, String> details
    ) {
        PowerGridSimulationExceptionApiResponse response = new PowerGridSimulationExceptionApiResponse(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                path,
                details
        );

        return ResponseEntity.status(status).body(response);
    }

}
