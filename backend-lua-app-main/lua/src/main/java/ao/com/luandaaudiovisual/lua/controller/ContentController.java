package ao.com.luandaaudiovisual.lua.controller;

import org.springframework.web.bind.annotation.RestController;

import ao.com.luandaaudiovisual.lua.dto.ContentRegistrationRequest;
import ao.com.luandaaudiovisual.lua.dto.ContentResponse;
import ao.com.luandaaudiovisual.lua.dto.ContentUpdateRequest;
import ao.com.luandaaudiovisual.lua.service.ContentService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/contents")
public class ContentController {

    ContentService service;

    public ContentController(ContentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ContentResponse> saveContent(@Valid @RequestBody ContentRegistrationRequest dto) {

        return ResponseEntity.status(HttpStatus.CREATED).body(service.saveContent(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentResponse> getContentById(@PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(service.getContentById(id));
    }

    @GetMapping()
    public ResponseEntity<List<ContentResponse>> getAllContents() {

        return ResponseEntity.status(HttpStatus.OK).body( service.getAllContents());
    }

    // Publicações do próprio estúdio/grupo, em qualquer estado (pendente,
    // aprovado, rejeitado) — para o painel do autor.
    @GetMapping("/mine")
    public ResponseEntity<List<ContentResponse>> getMyContents(@RequestParam Long ownerId) {

        return ResponseEntity.status(HttpStatus.OK).body(service.getContentsByOwner(ownerId));
    }


    @PutMapping("/{id}")
    public ResponseEntity<ContentResponse> updateContentDetails(@PathVariable Long id, @Valid @RequestBody ContentRegistrationRequest dto) {

        return ResponseEntity.status(HttpStatus.OK).body(service.updateContentDetails(id, dto));
    }

    @PatchMapping("/{id}/video")
    public ResponseEntity<ContentResponse> updateContent(@PathVariable Long id, @Valid @RequestBody ContentUpdateRequest dto) {
        
        return ResponseEntity.status(HttpStatus.OK).body(service.updateContent(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContentById(@PathVariable Long id) {

        service.deleteContentById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
