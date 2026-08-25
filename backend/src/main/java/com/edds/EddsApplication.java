package com.edds;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Enterprise Document Distribution System backend.
 *
 * The application exposes a small REST surface: authentication, a dynamic
 * document search, uploads and deletes, and a branch lookup. Everything else
 * in this package supports those four concerns.
 */
@SpringBootApplication
public class EddsApplication {

    public static void main(String[] args) {
        SpringApplication.run(EddsApplication.class, args);
    }
}
