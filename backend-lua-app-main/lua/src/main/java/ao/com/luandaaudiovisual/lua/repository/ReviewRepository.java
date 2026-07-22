package ao.com.luandaaudiovisual.lua.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ao.com.luandaaudiovisual.lua.model.Review;


public interface ReviewRepository extends JpaRepository<Review, Long>{

    List<Review> findByContentId(Long contentId);
    List<Review> findByUserId(Long userId);

}
