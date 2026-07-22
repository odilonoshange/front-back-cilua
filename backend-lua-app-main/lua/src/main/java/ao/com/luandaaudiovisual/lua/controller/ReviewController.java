package ao.com.luandaaudiovisual.lua.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ao.com.luandaaudiovisual.lua.dto.ReviewResponse;
import ao.com.luandaaudiovisual.lua.dto.ReviewWriteRequest;
import ao.com.luandaaudiovisual.lua.service.ReviewService;

@RestController
@RequestMapping("/api/contents")
public class ReviewController {

    private ReviewService service;

    public ReviewController(ReviewService service) {

        this.service = service;
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ReviewResponse> saveReview(@PathVariable Long id, @RequestBody ReviewWriteRequest dto) {

        return ResponseEntity.status(HttpStatus.CREATED).body(service.saveReview(id,dto));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<ReviewResponse>> getReviewsByContent(@PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(service.getReviewsByContentId(id));
    }
}
