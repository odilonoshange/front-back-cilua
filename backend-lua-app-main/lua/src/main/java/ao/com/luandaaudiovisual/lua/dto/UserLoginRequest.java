package ao.com.luandaaudiovisual.lua.dto;

import jakarta.validation.constraints.NotBlank;

public record UserLoginRequest
(
    @NotBlank(message = "o email é obrigatório")
    String email,
    @NotBlank(message = "a palavra-passe é obrigatória")
    String password
) {}
