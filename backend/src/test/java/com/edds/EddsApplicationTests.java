package com.edds;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * A smoke test that the Spring context builds with every bean wired. It runs
 * on the H2 profile so it needs no external database.
 */
@SpringBootTest
@ActiveProfiles("h2")
class EddsApplicationTests {

    @Test
    void contextLoads() {
    }
}
