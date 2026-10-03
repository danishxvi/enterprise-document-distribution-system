package com.edds.document;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;

/**
 * End to end checks of the HTTP surface against the seeded H2 database. Each
 * test that creates data uses a unique subject and searches for it, so tests
 * stay independent even though they share one application context.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class DocumentApiIntegrationTest {

    // Minimal bytes with the PDF magic header, which is what Tika inspects.
    private static final byte[] PDF_BYTES =
        "%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n"
            .getBytes(StandardCharsets.US_ASCII);

    @TempDir
    static Path storage;

    @DynamicPropertySource
    static void storageLocation(DynamicPropertyRegistry registry) {
        registry.add("edds.storage.location", () -> storage.toString());
    }

    @Autowired
    private MockMvc mvc;

    // ---------------------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------------------

    @Test
    void loginReturnsTokenAndProfile() throws Exception {
        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@edds.local\",\"password\":\"admin123\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isNotEmpty())
            .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    void wrongPasswordIsUnauthorized() throws Exception {
        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@edds.local\",\"password\":\"wrong\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    @Test
    void protectedEndpointWithoutTokenIsUnauthorized() throws Exception {
        mvc.perform(get("/api/documents")).andExpect(status().isUnauthorized());
    }

    @Test
    void healthEndpointIsPublic() throws Exception {
        mvc.perform(get("/actuator/health")).andExpect(status().isOk());
    }

    // ---------------------------------------------------------------------
    // Authorisation
    // ---------------------------------------------------------------------

    @Test
    void employeeCannotUpload() throws Exception {
        mvc.perform(upload(token("employee@edds.local", "employee123"), "Blocked", PDF_BYTES))
            .andExpect(status().isForbidden());
    }

    @Test
    void employeeCannotDelete() throws Exception {
        mvc.perform(delete("/api/documents/1")
                .header("Authorization", bearer(token("employee@edds.local", "employee123"))))
            .andExpect(status().isForbidden());
    }

    // ---------------------------------------------------------------------
    // Upload validation
    // ---------------------------------------------------------------------

    @Test
    void renamedNonPdfIsRejectedByContentInspection() throws Exception {
        byte[] script = "#!/bin/sh\necho not a pdf\n".getBytes(StandardCharsets.US_ASCII);
        mvc.perform(upload(adminToken(), "Fake", script))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value(startsWith("Only PDF files")));
    }

    @Test
    void invalidEnumFilterIsBadRequestNotServerError() throws Exception {
        mvc.perform(get("/api/documents").param("type", "MEMO")
                .header("Authorization", bearer(adminToken())))
            .andExpect(status().isBadRequest());
    }

    // ---------------------------------------------------------------------
    // Full lifecycle: publish, find, view, retire
    // ---------------------------------------------------------------------

    @Test
    void publishedDocumentCanBeFoundViewedAndRetired() throws Exception {
        String admin = adminToken();
        String employee = token("employee@edds.local", "employee123");
        String subject = "Lifecycle " + UUID.randomUUID();

        MvcResult created = mvc.perform(upload(admin, subject, PDF_BYTES))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.docType").value("CIRCULAR"))
            .andReturn();
        Integer id = JsonPath.read(created.getResponse().getContentAsString(), "$.id");

        // Employees can find it through the dynamic search.
        mvc.perform(get("/api/documents").param("search", subject)
                .header("Authorization", bearer(employee)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(1)))
            .andExpect(jsonPath("$.content[0].branchName").value("Operations"));

        // A filter that excludes it returns nothing.
        mvc.perform(get("/api/documents").param("search", subject).param("type", "ORDER")
                .header("Authorization", bearer(employee)))
            .andExpect(jsonPath("$.content", hasSize(0)));

        // The file streams back as a PDF.
        mvc.perform(get("/api/documents/" + id + "/view").header("Authorization", bearer(employee)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_PDF))
            .andExpect(header().string("Content-Disposition", startsWith("inline")));

        // Retiring it hides it from search and from the viewer.
        mvc.perform(delete("/api/documents/" + id).header("Authorization", bearer(admin)))
            .andExpect(status().isNoContent());
        mvc.perform(get("/api/documents").param("search", subject)
                .header("Authorization", bearer(employee)))
            .andExpect(jsonPath("$.content", hasSize(0)));
        mvc.perform(get("/api/documents/" + id + "/view").header("Authorization", bearer(employee)))
            .andExpect(status().isNotFound());
    }

    @Test
    void pageSizeIsCapped() throws Exception {
        mvc.perform(get("/api/documents").param("size", "5000")
                .header("Authorization", bearer(adminToken())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.size").value(50));
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------

    private RequestBuilder upload(
        String token, String subject, byte[] bytes) {
        return multipart("/api/documents")
            .file(new MockMultipartFile("file", "notice.pdf", "application/pdf", bytes))
            .param("subject", subject)
            .param("docType", "CIRCULAR")
            .param("branchId", "1")
            .param("issueDate", "2026-08-20")
            .header("Authorization", bearer(token));
    }

    private String adminToken() throws Exception {
        return token("admin@edds.local", "admin123");
    }

    private String token(String email, String password) throws Exception {
        MvcResult result = mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
            .andExpect(status().isOk())
            .andReturn();
        return JsonPath.read(result.getResponse().getContentAsString(), "$.token");
    }

    private static String bearer(String token) {
        return "Bearer " + token;
    }
}
