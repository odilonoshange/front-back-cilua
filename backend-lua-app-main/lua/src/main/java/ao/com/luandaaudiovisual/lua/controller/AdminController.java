package ao.com.luandaaudiovisual.lua.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ao.com.luandaaudiovisual.lua.dto.AdminStatsResponse;
import ao.com.luandaaudiovisual.lua.dto.ContentResponse;
import ao.com.luandaaudiovisual.lua.dto.ContentReviewRequest;
import ao.com.luandaaudiovisual.lua.dto.UserProfileResponse;
import ao.com.luandaaudiovisual.lua.model.ContentStatus;
import ao.com.luandaaudiovisual.lua.service.AdminService;
import jakarta.validation.Valid;

// Todas as rotas aqui exigem o cabeçalho X-User-Id com o id do utilizador
// autenticado; o AdminService confirma que esse utilizador é ADMIN antes
// de qualquer operação (ver AdminService.requireAdmin).
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats(@RequestHeader("X-User-Id") Long adminId) {
        return ResponseEntity.ok(service.getStats(adminId));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getUsers(@RequestHeader("X-User-Id") Long adminId) {
        return ResponseEntity.ok(service.getUsers(adminId));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@RequestHeader("X-User-Id") Long adminId, @PathVariable Long id) {
        service.deleteUser(adminId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/contents")
    public ResponseEntity<List<ContentResponse>> getContents(
            @RequestHeader("X-User-Id") Long adminId,
            @RequestParam(required = false) ContentStatus status) {
        return ResponseEntity.ok(service.getContentsByStatus(adminId, status));
    }

    @PatchMapping("/contents/{id}/approve")
    public ResponseEntity<ContentResponse> approve(@RequestHeader("X-User-Id") Long adminId, @PathVariable Long id) {
        return ResponseEntity.ok(service.approve(adminId, id));
    }

    @PatchMapping("/contents/{id}/reject")
    public ResponseEntity<ContentResponse> reject(
            @RequestHeader("X-User-Id") Long adminId,
            @PathVariable Long id,
            @Valid @RequestBody ContentReviewRequest dto) {
        return ResponseEntity.ok(service.reject(adminId, id, dto.reason()));
    }

    @GetMapping("/reports/pdf")
    public ResponseEntity<byte[]> downloadReport(@RequestHeader("X-User-Id") Long adminId) {
        byte[] pdf = service.generatePdfReport(adminId);
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-cineangola.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
