package ao.com.luandaaudiovisual.lua.dto;

import java.util.List;
import java.util.Map;

public record AdminStatsResponse
(
    long totalUsers,
    Map<String, Long> usersByRole,
    long totalPublications,
    Map<String, Long> publicationsByStatus,
    List<StudioPublicationCount> publicationsByStudio
) {
    public record StudioPublicationCount(Long ownerId, String ownerName, long total) {}
}
