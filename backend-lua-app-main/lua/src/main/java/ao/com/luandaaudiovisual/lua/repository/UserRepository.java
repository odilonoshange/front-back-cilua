package ao.com.luandaaudiovisual.lua.repository;

import java.util.Optional;

import ao.com.luandaaudiovisual.lua.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
