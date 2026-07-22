package ao.com.luandaaudiovisual.lua.dto;

import java.time.LocalDate;

import ao.com.luandaaudiovisual.lua.model.TypeContent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record ContentRegistrationRequest
(
    @NotNull(message = "defina o tipo de conteúdo, peça ou filme")
    TypeContent typeContent,
    @NotBlank(message = "defina o título do conteúdo")
    String title,
    String description,
    String details,
    String category,
    String coverUrl,
    LocalDate eventDate,
    String eventLocation,
    // Id do utilizador (estúdio/grupo) que está a publicar. Só é obrigatório
    // ao CRIAR (ver ContentService.saveContent) — este mesmo DTO também é
    // usado para EDITAR (PUT /contents/{id}), onde o dono já está definido
    // e o frontend não o reenvia, por isso não pode ser @NotNull aqui.
    Long ownerId
) {}
