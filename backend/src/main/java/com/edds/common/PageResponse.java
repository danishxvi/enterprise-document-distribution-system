package com.edds.common;

import java.util.List;
import org.springframework.data.domain.Page;

/**
 * A trimmed, stable pagination envelope. Spring's own Page serialises with a
 * large and version sensitive JSON shape, so the API returns this instead and
 * the frontend can rely on exactly these fields.
 */
public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages()
        );
    }
}
