package ao.com.luandaaudiovisual.lua.dto;

import jakarta.validation.constraints.NotBlank;

// Corpo usado pelo admin para rejeitar uma publicação, indicando o motivo.
public record ContentReviewRequest
(
    @NotBlank(message = "indique o motivo da rejeição")
    String reason
) {}
