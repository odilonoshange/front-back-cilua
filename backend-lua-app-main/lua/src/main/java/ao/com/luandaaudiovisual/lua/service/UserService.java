package ao.com.luandaaudiovisual.lua.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
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

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileResponse saveUser(UserRegistrationRequest dto) {
        if (dto.role() == UserRole.ADMIN) {
            throw new BusinessRoleException("Não é possível registar uma conta de administrador por aqui.");
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(dto.role());

        repository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public UserProfileResponse login(UserLoginRequest dto) {
        User user = repository.findByEmail(dto.email())
                .orElseThrow(() -> new InvalidCredentialsException("Email ou palavra-passe inválidos."));

        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Email ou palavra-passe inválidos.");
        }

        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public UserProfileResponse getUserById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public List<UserProfileResponse> getAllUsers() {
        return repository.findAll()
                .stream()
                .map(e -> new UserProfileResponse(e.getId(), e.getName(), e.getEmail(), e.getRole()))
                .toList();
    }

    public UserProfileResponse updateUser(Long id, UserUpdateRequest dto) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        user.setName(dto.name());
        repository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public void deleteUserById(Long id) {
        repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        repository.deleteById(id);
    }
}
