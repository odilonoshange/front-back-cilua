package ao.com.luandaaudiovisual.lua.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique= true)
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    //tipoDeUtilizador
    private UserRole role;
}
