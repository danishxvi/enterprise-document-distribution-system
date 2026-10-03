package com.edds.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/**
 * Plain unit tests for token issuing and validation. No Spring context is
 * needed, so these run in milliseconds.
 */
class JwtServiceTest {

    private static final String SECRET = "a-test-secret-that-is-comfortably-longer-than-32-bytes";

    @Test
    void issuedTokenCarriesTheEmailAndValidates() {
        JwtService jwt = new JwtService(SECRET, 60_000);

        String token = jwt.generateToken("admin@edds.local", "ADMIN");

        assertThat(jwt.isValid(token)).isTrue();
        assertThat(jwt.extractEmail(token)).isEqualTo("admin@edds.local");
    }

    @Test
    void expiredTokenIsRejected() {
        JwtService jwt = new JwtService(SECRET, -1_000);

        String token = jwt.generateToken("admin@edds.local", "ADMIN");

        assertThat(jwt.isValid(token)).isFalse();
    }

    @Test
    void tamperedTokenIsRejected() {
        JwtService jwt = new JwtService(SECRET, 60_000);
        String token = jwt.generateToken("employee@edds.local", "EMPLOYEE");

        // Flip one character of the signature.
        char last = token.charAt(token.length() - 1);
        String tampered = token.substring(0, token.length() - 1) + (last == 'A' ? 'B' : 'A');

        assertThat(jwt.isValid(tampered)).isFalse();
    }

    @Test
    void tokenSignedWithAnotherSecretIsRejected() {
        JwtService issuer = new JwtService(SECRET, 60_000);
        JwtService verifier = new JwtService(SECRET + "-different", 60_000);

        String token = issuer.generateToken("admin@edds.local", "ADMIN");

        assertThat(verifier.isValid(token)).isFalse();
    }
}
