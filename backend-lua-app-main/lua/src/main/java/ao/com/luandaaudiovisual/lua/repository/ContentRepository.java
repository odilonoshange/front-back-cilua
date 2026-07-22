package ao.com.luandaaudiovisual.lua.repository;

import java.util.List;

import ao.com.luandaaudiovisual.lua.model.Content;
import ao.com.luandaaudiovisual.lua.model.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByStatus(ContentStatus status);
    List<Content> findByOwnerId(Long ownerId);
}
