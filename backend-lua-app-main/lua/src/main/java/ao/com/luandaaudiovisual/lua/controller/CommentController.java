package ao.com.luandaaudiovisual.lua.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ao.com.luandaaudiovisual.lua.service.ReviewService;

// Path próprio (/api/comments) para apagar um comentário/review isolado,
// já que a review deixa de fazer sentido "aninhada" a um conteúdo assim
// que se conhece apenas o seu id.
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private ReviewService service;

    public CommentController(ReviewService service) {
        this.service = service;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id) {

        service.deleteReview(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
