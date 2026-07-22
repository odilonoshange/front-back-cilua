package ao.com.luandaaudiovisual.lua.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ao.com.luandaaudiovisual.lua.dto.ReviewResponse;
import ao.com.luandaaudiovisual.lua.dto.ReviewWriteRequest;
import ao.com.luandaaudiovisual.lua.exception.ResourceNotFoundException;
import ao.com.luandaaudiovisual.lua.model.Review;
import ao.com.luandaaudiovisual.lua.repository.ContentRepository;
import ao.com.luandaaudiovisual.lua.repository.ReviewRepository;
import ao.com.luandaaudiovisual.lua.repository.UserRepository;

@Service
public class ReviewService {

    private ReviewRepository reviewRepo;
    private UserRepository userRepo;
    private ContentRepository contentRepo;

    public ReviewService(ReviewRepository reviewRepo, UserRepository userRepo, ContentRepository contentRepo) {

        this.reviewRepo = reviewRepo;
        this.userRepo = userRepo;
        this.contentRepo = contentRepo;
    }


    public ReviewResponse saveReview(Long contentId, ReviewWriteRequest dto) {

        Review review = new Review();

        var userFound = userRepo.findById(dto.userId()).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        var contentFound = contentRepo.findById(contentId).orElseThrow(() -> new ResourceNotFoundException("Conteúdo inexistente."));

        review.setCommentary(dto.commentary());
        review.setRating(dto.rating());
        review.setUser(userFound);
        review.setContent(contentFound);

        reviewRepo.save(review);

        return new ReviewResponse
                (
                    review.getId(), review.getCommentary(), review.getRating(), userFound.getName()
                );

    }

    public List<ReviewResponse> getReviewsByContentId(Long contentId) {

        contentRepo.findById(contentId).orElseThrow(() -> new ResourceNotFoundException("Conteúdo inexistente."));

        return reviewRepo.findByContentId(contentId)
                .stream()
                .map(e -> new ReviewResponse(e.getId(), e.getCommentary(), e.getRating(), e.getUser().getName()))
                .toList();
    }

    public void deleteReview(Long id) {

        reviewRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Comentário não encontrado."));
        reviewRepo.deleteById(id);
    }

}
