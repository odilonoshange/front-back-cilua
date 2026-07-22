package ao.com.luandaaudiovisual.lua.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ao.com.luandaaudiovisual.lua.dto.AdminStatsResponse;
import ao.com.luandaaudiovisual.lua.dto.ContentResponse;
import ao.com.luandaaudiovisual.lua.dto.UserProfileResponse;
import ao.com.luandaaudiovisual.lua.exception.AccessDeniedException;
import ao.com.luandaaudiovisual.lua.exception.BusinessRoleException;
import ao.com.luandaaudiovisual.lua.exception.ResourceNotFoundException;
import ao.com.luandaaudiovisual.lua.model.Content;
import ao.com.luandaaudiovisual.lua.model.ContentStatus;
import ao.com.luandaaudiovisual.lua.model.User;
import ao.com.luandaaudiovisual.lua.model.UserRole;
import ao.com.luandaaudiovisual.lua.repository.ContentRepository;
import ao.com.luandaaudiovisual.lua.repository.ReviewRepository;
import ao.com.luandaaudiovisual.lua.repository.UserRepository;

@Service
public class AdminService {

    private final ContentRepository contentRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ContentService contentService;

    public AdminService(ContentRepository contentRepository, UserRepository userRepository,
            ReviewRepository reviewRepository, ContentService contentService) {
        this.contentRepository = contentRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.contentService = contentService;
    }

    // Verificação simples de role: não há JWT, por isso o frontend envia o
    // id do utilizador autenticado (localStorage) em cada pedido de admin,
    // e aqui confirmamos que esse utilizador existe e é mesmo ADMIN antes
    // de deixar prosseguir. Não é tão forte quanto Spring Security + JWT,
    // mas impede que qualquer pessoa chame estas rotas sem ser admin.
    private User requireAdmin(Long adminId) {
        if (adminId == null) {
            throw new AccessDeniedException("Acesso restrito ao administrador.");
        }
        User user = userRepository.findById(adminId)
                .orElseThrow(() -> new AccessDeniedException("Acesso restrito ao administrador."));
        if (user.getRole() != UserRole.ADMIN) {
            throw new AccessDeniedException("Acesso restrito ao administrador.");
        }
        return user;
    }

    public List<UserProfileResponse> getUsers(Long adminId) {
        requireAdmin(adminId);
        return userRepository.findAll()
                .stream()
                .map(u -> new UserProfileResponse(u.getId(), u.getName(), u.getEmail(), u.getRole()))
                .toList();
    }

    // Elimina um utilizador registado. Bloqueia com uma mensagem clara em
    // vez de deixar rebentar um erro de chave estrangeira (500) quando o
    // utilizador ainda tem publicações ou comentários associados.
    @Transactional
    public void deleteUser(Long adminId, Long userId) {
        User admin = requireAdmin(adminId);

        if (admin.getId().equals(userId)) {
            throw new BusinessRoleException("Não podes eliminar a tua própria conta de administrador.");
        }

        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador não encontrado."));

        boolean hasContent = !contentRepository.findByOwnerId(userId).isEmpty();
        boolean hasReviews = !reviewRepository.findByUserId(userId).isEmpty();

        if (hasContent || hasReviews) {
            throw new BusinessRoleException(
                    "Não é possível eliminar \"" + target.getName() + "\": ainda tem publicações ou comentários associados.");
        }

        try {
            userRepository.deleteById(userId);
            userRepository.flush();
        } catch (DataIntegrityViolationException e) {
            // Rede de segurança para qualquer referência que não tenhamos
            // previsto acima — evita um erro 500 em branco no frontend.
            throw new BusinessRoleException(
                    "Não é possível eliminar \"" + target.getName() + "\": ainda está associado a outros dados do sistema.");
        }
    }

    public List<ContentResponse> getContentsByStatus(Long adminId, ContentStatus status) {
        requireAdmin(adminId);
        List<Content> contents = status != null ? contentRepository.findByStatus(status) : contentRepository.findAll();
        return contents.stream().map(contentService::toResponse).toList();
    }

    public AdminStatsResponse getStats(Long adminId) {
        requireAdmin(adminId);

        List<User> users = userRepository.findAll();
        List<Content> contents = contentRepository.findAll();

        Map<String, Long> usersByRole = users.stream()
                .collect(Collectors.groupingBy(u -> u.getRole().name(), LinkedHashMap::new, Collectors.counting()));

        Map<String, Long> publicationsByStatus = contents.stream()
                .collect(Collectors.groupingBy(c -> c.getStatus() != null ? c.getStatus().name() : "SEM_ESTADO",
                        LinkedHashMap::new, Collectors.counting()));

        Map<Long, AdminStatsResponse.StudioPublicationCount> byStudio = new LinkedHashMap<>();
        for (Content c : contents) {
            if (c.getOwner() == null) continue;
            Long ownerId = c.getOwner().getId();
            byStudio.merge(ownerId,
                    new AdminStatsResponse.StudioPublicationCount(ownerId, c.getOwner().getName(), 1),
                    (existing, added) -> new AdminStatsResponse.StudioPublicationCount(
                            existing.ownerId(), existing.ownerName(), existing.total() + 1));
        }

        List<AdminStatsResponse.StudioPublicationCount> publicationsByStudio = byStudio.values().stream()
                .sorted(Comparator.comparingLong(AdminStatsResponse.StudioPublicationCount::total).reversed())
                .toList();

        return new AdminStatsResponse(
                users.size(),
                usersByRole,
                contents.size(),
                publicationsByStatus,
                publicationsByStudio
        );
    }

    public ContentResponse approve(Long adminId, Long contentId) {
        requireAdmin(adminId);
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Conteúdo não encontrado."));
        content.setStatus(ContentStatus.APPROVED);
        content.setRejectionReason(null);
        content.setReviewedAt(LocalDateTime.now());
        contentRepository.save(content);
        return contentService.toResponse(content);
    }

    public ContentResponse reject(Long adminId, Long contentId, String reason) {
        requireAdmin(adminId);
        if (reason == null || reason.isBlank()) {
            throw new BusinessRoleException("É obrigatório indicar o motivo da rejeição.");
        }
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Conteúdo não encontrado."));
        content.setStatus(ContentStatus.REJECTED);
        content.setRejectionReason(reason);
        content.setReviewedAt(LocalDateTime.now());
        contentRepository.save(content);
        return contentService.toResponse(content);
    }

    // Relatório em PDF: utilizadores, publicações por estúdio, e histórico
    // de aprovações/rejeições com datas.
    public byte[] generatePdfReport(Long adminId) {
        requireAdmin(adminId);

        List<User> users = userRepository.findAll();
        List<Content> contents = contentRepository.findAll();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        try (PDDocument document = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(document);
            writer.title("Relatório CineAngola");

            writer.heading("Utilizadores registados (" + users.size() + ")");
            for (User u : users) {
                writer.line(u.getName() + " — " + u.getEmail() + " — " + u.getRole());
            }
            writer.spacer();

            writer.heading("Publicações por estúdio/grupo");
            Map<String, Long> byStudio = contents.stream()
                    .filter(c -> c.getOwner() != null)
                    .collect(Collectors.groupingBy(c -> c.getOwner().getName(), LinkedHashMap::new, Collectors.counting()));
            for (Map.Entry<String, Long> entry : byStudio.entrySet()) {
                writer.line(entry.getKey() + ": " + entry.getValue() + " publicação(ões)");
            }
            writer.spacer();

            writer.heading("Histórico de aprovações e rejeições");
            List<Content> reviewed = contents.stream()
                    .filter(c -> c.getReviewedAt() != null)
                    .sorted(Comparator.comparing(Content::getReviewedAt).reversed())
                    .toList();
            if (reviewed.isEmpty()) {
                writer.line("Ainda não há publicações avaliadas.");
            }
            for (Content c : reviewed) {
                String data = c.getReviewedAt().format(fmt);
                String estado = c.getStatus() == ContentStatus.APPROVED ? "APROVADO" : "REJEITADO";
                String linha = data + " — \"" + c.getTitle() + "\" — " + estado;
                if (c.getStatus() == ContentStatus.REJECTED && c.getRejectionReason() != null) {
                    linha += " (motivo: " + c.getRejectionReason() + ")";
                }
                writer.line(linha);
            }

            writer.close();
            document.save(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Não foi possível gerar o relatório em PDF.", e);
        }
    }

    // Pequeno auxiliar interno para escrever texto em várias páginas PDF
    // sem repetir a lógica de posicionamento/quebra de página em cada bloco.
    private static class PdfWriter {
        private final PDDocument document;
        private PDPage page;
        private PDPageContentStream content;
        private float y;
        private static final float MARGIN = 50;
        private static final float LEADING = 16;

        PdfWriter(PDDocument document) throws IOException {
            this.document = document;
            newPage();
        }

        private void newPage() throws IOException {
            if (content != null) {
                content.close();
            }
            page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            content = new PDPageContentStream(document, page);
            y = page.getMediaBox().getHeight() - MARGIN;
        }

        void title(String text) throws IOException {
            content.beginText();
            content.setFont(PDType1Font.HELVETICA_BOLD, 18);
            content.newLineAtOffset(MARGIN, y);
            content.showText(text);
            content.endText();
            y -= LEADING * 2;
        }

        void heading(String text) throws IOException {
            ensureSpace();
            content.beginText();
            content.setFont(PDType1Font.HELVETICA_BOLD, 13);
            content.newLineAtOffset(MARGIN, y);
            content.showText(text);
            content.endText();
            y -= LEADING * 1.3f;
        }

        void line(String text) throws IOException {
            ensureSpace();
            content.beginText();
            content.setFont(PDType1Font.HELVETICA, 11);
            content.newLineAtOffset(MARGIN, y);
            content.showText(sanitize(text));
            content.endText();
            y -= LEADING;
        }

        void spacer() {
            y -= LEADING;
        }

        private void ensureSpace() throws IOException {
            if (y < MARGIN + LEADING) {
                newPage();
            }
        }

        private String sanitize(String text) {
            // A fonte Helvetica base do PDFBox só suporta WinAnsiEncoding;
            // removemos caracteres fora desse conjunto para evitar erro ao gerar o PDF.
            return text.replaceAll("[^\\x00-\\xFF]", "?");
        }

        void close() throws IOException {
            content.close();
        }
    }
}
