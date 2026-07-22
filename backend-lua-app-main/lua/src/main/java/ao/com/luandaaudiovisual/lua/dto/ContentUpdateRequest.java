package ao.com.luandaaudiovisual.lua.dto;

import jakarta.validation.constraints.NotBlank;

public record ContentUpdateRequest
(
    @NotBlank
    String videoUrl,
    // Opcional: permite reenviar o cartaz nesta mesma etapa, se necessário.
    String coverUrl
) {}
