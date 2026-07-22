package ao.com.luandaaudiovisual.lua.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


import org.springframework.stereotype.Service;


import ao.com.luandaaudiovisual.lua.dto.ContentRegistrationRequest;
import ao.com.luandaaudiovisual.lua.dto.ContentResponse;
import ao.com.luandaaudiovisual.lua.dto.ContentUpdateRequest;
import ao.com.luandaaudiovisual.lua.dto.ReviewResponse;
import ao.com.luandaaudiovisual.lua.model.Content;
import ao.com.luandaaudiovisual.lua.model.ContentStatus;
import ao.com.luandaaudiovisual.lua.model.User;
import ao.com.luandaaudiovisual.lua.repository.ContentRepository;
import ao.com.luandaaudiovisual.lua.repository.UserRepository;

import ao.com.luandaaudiovisual.lua.exception.BusinessRoleException;
import ao.com.luandaaudiovisual.lua.exception.ResourceNotFoundException;

@Service
public class ContentService {

    private ContentRepository repository;
    private UserRepository userRepository;

    public ContentService(ContentRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public ContentResponse saveContent(ContentRegistrationRequest dto) {

        if (dto.ownerId() == null) {
            throw new BusinessRoleException("Utilizador (autor) da publicação é obrigatório.");
        }

        User owner = userRepository.findById(dto.ownerId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador (autor) não encontrado."));

        Content content = new Content();

        content.setTitle(dto.title());
        content.setTypeContent(dto.typeContent());
        content.setDescription(dto.description());
        content.setDetails(dto.details());
        content.setCategory(dto.category());
        content.setCoverUrl(dto.coverUrl());
        content.setEventDate(dto.eventDate());
        content.setEventLocation(dto.eventLocation());
        content.setOwner(owner);
        // Toda publicação nova aguarda validação do administrador antes de
        // ficar visível ao público.
        content.setStatus(ContentStatus.PENDING);

        repository.save(content);

        return mapToContentDTO(content);
    }

    public ContentResponse getContentById(Long id) {

        var content = repository.findById(id).orElseThrow(() -> {throw new ResourceNotFoundException("Conteúdo não encontrado");});

        return mapToContentDTO(content);

    }


    // Catálogo público: só conteúdos já aprovados pelo administrador.
    public List<ContentResponse> getAllContents() {

        return repository.findByStatus(ContentStatus.APPROVED)
        .stream()
        .map(this::mapToContentDTO)
        .toList();

    }

    // Publicações de um estúdio/grupo específico, em qualquer estado
    // (pendente, aprovado ou rejeitado) — usado no painel do próprio autor.
    public List<ContentResponse> getContentsByOwner(Long ownerId) {

        return repository.findByOwnerId(ownerId)
        .stream()
        .map(this::mapToContentDTO)
        .toList();
    }

    public ContentResponse updateContentDetails(Long id, ContentRegistrationRequest dto) {

        var content = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado."));

        content.setTitle(dto.title());
        content.setTypeContent(dto.typeContent());
        content.setDescription(dto.description());
        content.setDetails(dto.details());
        content.setCategory(dto.category());
        content.setEventDate(dto.eventDate());
        content.setEventLocation(dto.eventLocation());
        if (dto.coverUrl() != null) {
            content.setCoverUrl(dto.coverUrl());
        }

        // Reenvio automático: se a publicação tinha sido rejeitada, ao ser
        // editada volta a PENDING para o administrador validar de novo.
        if (content.getStatus() == ContentStatus.REJECTED) {
            content.setStatus(ContentStatus.PENDING);
            content.setRejectionReason(null);
            content.setReviewedAt(null);
        }

        repository.save(content);

        return mapToContentDTO(content);
    }

    public ContentResponse updateContent(Long id, ContentUpdateRequest dto) {

        var content = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado."));

        if (content.getEventDate().isAfter(LocalDate.now())) {
            throw new BusinessRoleException("Você ainda não pode fazer upload de vídeo.");
        }

        content.setVideoUrl(dto.videoUrl());
        if (dto.coverUrl() != null && !dto.coverUrl().isBlank()) {
            content.setCoverUrl(dto.coverUrl());
        }

        repository.save(content);

        return mapToContentDTO(content);
    }

    public void deleteContentById(Long id) {

        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Não existe um conteúdo com este id."));
        repository.deleteById(id);
    }


    // Exposto para o AdminService reutilizar o mesmo mapeamento ao devolver
    // conteúdos nas rotas de moderação/admin.
    public ContentResponse toResponse(Content content) {
        return mapToContentDTO(content);
    }

    private ContentResponse mapToContentDTO(Content content) {


        List<ReviewResponse> reviews = new ArrayList<>();

        if (content.getReviews() != null && !(content.getReviews().isEmpty())) {

            reviews = content.getReviews()
            .stream()
            .map(
                    e -> new ReviewResponse(e.getId(), e.getCommentary(), e.getRating(), e.getUser().getName())
                )
            .toList();
        }

        Long ownerId = content.getOwner() != null ? content.getOwner().getId() : null;
        String ownerName = content.getOwner() != null ? content.getOwner().getName() : null;

        return new ContentResponse
        (
            content.getId(),
            content.getTypeContent(),
            content.getTitle(),
            content.getDescription(),
            content.getDetails(),
            content.getCategory(),
            content.getCoverUrl(),
            content.getVideoUrl(),
            content.getEventDate(),
            content.getEventLocation(),
            reviews,
            ownerId,
            ownerName,
            content.getStatus(),
            content.getRejectionReason(),
            content.getReviewedAt()
        );
    }

}
