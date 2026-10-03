package com.edds.branch;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Serves the branch master list for any client that needs it. Read only, and
 * available to any authenticated user. The bundled web client ships the same
 * seeded list as a constant, so this endpoint is the source of truth for
 * integrations and for deployments that add branches of their own.
 */
@RestController
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchRepository branches;

    public BranchController(BranchRepository branches) {
        this.branches = branches;
    }

    public record BranchResponse(Long id, String name, String code) {
    }

    @GetMapping
    public List<BranchResponse> list() {
        return branches.findAll().stream()
            .map(b -> new BranchResponse(b.getId(), b.getName(), b.getCode()))
            .toList();
    }
}
