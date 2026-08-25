package com.edds.auth;

import com.edds.security.AppUserDetails;
import com.edds.security.JwtService;
import com.edds.user.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The single authentication endpoint. It verifies credentials through the
 * authentication manager and, on success, returns a signed token plus a small
 * profile the frontend uses to render the user and gate admin routes.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {
    }

    public record UserProfile(Long id, String name, String email, String role) {
    }

    public record AuthResponse(String token, UserProfile user) {
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        // A BadCredentialsException here is turned into a 401 by the handler.
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = ((AppUserDetails) authentication.getPrincipal()).getUser();
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(
            token,
            new UserProfile(user.getId(), user.getName(), user.getEmail(), user.getRole().name())
        );
    }
}
