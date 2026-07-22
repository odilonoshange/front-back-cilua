package ao.com.luandaaudiovisual.lua.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import ao.com.luandaaudiovisual.lua.model.ContentStatus;
import ao.com.luandaaudiovisual.lua.model.TypeContent;
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ContentResponse
(
    Long id,
    TypeContent typeContent,
    String title,
    String description,
    String details,
    String category,
    String coverUrl,
    String videoUrl,
    LocalDate eventDate,
    String eventLocation,
    List<ReviewResponse> reviews,
    Long ownerId,
    String ownerName,
    ContentStatus status,
    String rejectionReason,
    LocalDateTime reviewedAt
) {}
