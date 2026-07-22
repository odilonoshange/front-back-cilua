package ao.com.luandaaudiovisual.lua.dto;

import ao.com.luandaaudiovisual.lua.model.UserRole;
import jakarta.validation.constraints.NotBlank;

public record UserRegistrationRequest
(
    @NotBlank
    String name,
    @NotBlank
    String email,
    @NotBlank
    String password,
    UserRole role
) {}
