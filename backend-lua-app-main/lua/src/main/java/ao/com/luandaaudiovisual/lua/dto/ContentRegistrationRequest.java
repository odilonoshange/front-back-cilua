package ao.com.luandaaudiovisual.lua.dto;

import java.time.LocalDate;

import ao.com.luandaaudiovisual.lua.model.TypeContent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ContentRegistrationRequest(
        @NotNull(message = "defina o tipo de conteúdo, peça ou filme")
        TypeContent typeContent,

        @NotBlank(message = "defina o título do conteúdo")
        String title,

        String description,
        String details,

        @NotBlank(message = "defina a categoria do conteúdo")
        String category,

        @NotBlank(message = "defina o cartaz do conteúdo")
        String coverUrl,

        LocalDate eventDate,
        String eventLocation,
        Long ownerId
) {}
