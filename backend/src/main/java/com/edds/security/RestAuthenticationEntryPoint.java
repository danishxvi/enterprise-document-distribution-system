package com.edds.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * Returns a clean 401 with the standard error body when an unauthenticated
 * request hits a protected endpoint. Without this, Spring Security answers
 * anonymous requests with a bare 403, which reads as "forbidden" rather than
 * "please sign in".
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException authException
    ) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        String body = """
            {"status":401,"error":"Unauthorized",\
            "message":"Authentication is required to access this resource.",\
            "path":"%s"}""".formatted(request.getRequestURI());
        response.getWriter().write(body);
    }
}
