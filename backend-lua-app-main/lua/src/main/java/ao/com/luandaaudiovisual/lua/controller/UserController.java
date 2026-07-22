package ao.com.luandaaudiovisual.lua.controller;


import java.util.List;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ao.com.luandaaudiovisual.lua.dto.UserLoginRequest;
import ao.com.luandaaudiovisual.lua.dto.UserRegistrationRequest;
import ao.com.luandaaudiovisual.lua.dto.UserUpdateRequest;
import ao.com.luandaaudiovisual.lua.dto.UserProfileResponse;
import ao.com.luandaaudiovisual.lua.service.UserService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("api/users")
public class UserController {

    private UserService service;

    public UserController(UserService service) {

        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UserProfileResponse> saveUser(@RequestBody @Valid UserRegistrationRequest dto) {

        return ResponseEntity.status(HttpStatus.CREATED).body(service.saveUser(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<UserProfileResponse> login(@RequestBody @Valid UserLoginRequest dto) {

        return ResponseEntity.status(HttpStatus.OK).body(service.login(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(service.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(service.getAllUsers());
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateUserById(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest dto) {
        return ResponseEntity.status(HttpStatus.OK).body(service.updateUser(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long id) {

        service.deleteUserById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    

}
