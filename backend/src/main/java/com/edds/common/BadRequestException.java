package com.edds.common;

/** Thrown for client errors: bad input, wrong file type, and the like. */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
