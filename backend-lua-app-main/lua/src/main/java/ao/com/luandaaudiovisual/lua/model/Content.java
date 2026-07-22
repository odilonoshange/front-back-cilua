package ao.com.luandaaudiovisual.lua.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;



@Entity
@Table(name = "content")
@Getter
@Setter
@NoArgsConstructor
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private TypeContent typeContent;
    private String title;
    private String description;
    // Descrição completa/detalhada (distinta da sinopse curta em "description").
    @Column(columnDefinition = "TEXT")
    private String details;
    private String category;
    @Column(nullable = true)
    private String videoUrl;
    @Column(nullable = false)
    private String coverUrl;
    @OneToMany(mappedBy="content")
    private List<Review> reviews;
    private LocalDate eventDate;
    private String eventLocation;

    // Estúdio/grupo autor da publicação.
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    // Fluxo de moderação: toda publicação nasce PENDING e só fica visível
    // ao público em geral depois de o administrador aprovar.
    @Enumerated(EnumType.STRING)
    private ContentStatus status = ContentStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    private LocalDateTime reviewedAt;
}
