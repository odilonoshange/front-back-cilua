package ao.com.luandaaudiovisual.lua.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

// Endpoint real de upload. Substitui a simulação que existia apenas no
// frontend (uploads.js -> simulateExternalUpload), que gerava URLs falsas
// em "https://cdn.example.com/..." e nunca guardava o ficheiro em lado
// nenhum. Aqui o ficheiro é gravado em disco e é devolvido um URL real,
// acessível através do resource handler configurado em WebConfig.
@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("url", store(file, "images")));
    }

    @PostMapping("/video")
    public ResponseEntity<Map<String, String>> uploadVideo(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("url", store(file, "videos")));
    }

    private String store(MultipartFile file, String subfolder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Ficheiro vazio ou não enviado.");
        }

        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storedName = UUID.randomUUID() + "_" + safeName;

        Path targetDir = Paths.get(uploadDir, subfolder);
        Files.createDirectories(targetDir);

        Path targetPath = targetDir.resolve(storedName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Constrói o URL público absoluto com base na própria requisição,
        // para funcionar tanto em localhost como noutro host/porta.
        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        return baseUrl + "/uploads/" + subfolder + "/" + storedName;
    }
}
