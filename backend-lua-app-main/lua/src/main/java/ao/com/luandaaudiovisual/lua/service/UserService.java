package ao.com.luandaaudiovisual.lua.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ao.com.luandaaudiovisual.lua.dto.UserLoginRequest;
import ao.com.luandaaudiovisual.lua.dto.UserRegistrationRequest;
import ao.com.luandaaudiovisual.lua.dto.UserUpdateRequest;
import ao.com.luandaaudiovisual.lua.dto.UserProfileResponse;
import ao.com.luandaaudiovisual.lua.exception.BusinessRoleException;
import ao.com.luandaaudiovisual.lua.exception.InvalidCredentialsException;
import ao.com.luandaaudiovisual.lua.exception.ResourceNotFoundException;
import ao.com.luandaaudiovisual.lua.model.User;
import ao.com.luandaaudiovisual.lua.model.UserRole;
import ao.com.luandaaudiovisual.lua.repository.UserRepository;

@Service
public class UserService {

    private UserRepository repository;

    public UserService(UserRepository repository) {

        this.repository = repository;
    }

    public UserProfileResponse saveUser(UserRegistrationRequest dto) {

        // Contas ADMIN nunca nascem do registo público — têm de ser criadas
        // directamente na base de dados. Sem esta verificação, qualquer
        // pessoa poderia enviar role=ADMIN neste endpoint e contornar toda
        // a validação de admin feita noutras rotas.
        if (dto.role() == UserRole.ADMIN) {
            throw new BusinessRoleException("Não é possível registar uma conta de administrador por aqui.");
        }

        User user = new User();

        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setRole(dto.role());

        repository.save(user);

        return new UserProfileResponse
        (
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
    }

    // NOTA: comparação de password em texto simples porque o backend ainda não
    // tem mecanismo de autenticação/hashing implementado (ver relatório de
    // alinhamento). Antes de ir para produção isto deve usar BCrypt.
    public UserProfileResponse login(UserLoginRequest dto) {

        User user = repository.findByEmail(dto.email())
                .orElseThrow(() -> new InvalidCredentialsException("Email ou palavra-passe inválidos."));

        if (!user.getPassword().equals(dto.password())) {
            throw new InvalidCredentialsException("Email ou palavra-passe inválidos.");
        }

        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public UserProfileResponse getUserById(Long id) {

        User user = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());

    }

    public List<UserProfileResponse> getAllUsers() {

        List<UserProfileResponse> users = repository.findAll()
                    .stream()
                    .map(e -> new UserProfileResponse(e.getId(), e.getName(), e.getEmail(), e.getRole()))
                    .toList();

        return users;
    }

    public UserProfileResponse updateUser(Long id, UserUpdateRequest dto) {

        User user = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        user.setName(dto.name());
        
        repository.save(user);

        return new UserProfileResponse
        (
            user.getId(), 
            user.getName(), 
            user.getEmail(), 
            user.getRole()
        );

    }

    public void deleteUserById(Long id) {

        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        repository.deleteById(id);
    }

}