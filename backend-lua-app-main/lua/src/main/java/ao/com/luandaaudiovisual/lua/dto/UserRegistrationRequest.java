package ao.com.luandaaudiovisual.lua.dto;

import ao.com.luandaaudiovisual.lua.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRegistrationRequest(
        @NotBlank(message = "defina o nome do utilizador")
        String name,

        @NotBlank(message = "defina o email do utilizador")
        @Email(message = "defina um email válido")
        String email,

        @NotBlank(message = "defina a palavra-passe")
        String password,

        @NotNull(message = "defina o tipo de utilizador")
        UserRole role
) {}
