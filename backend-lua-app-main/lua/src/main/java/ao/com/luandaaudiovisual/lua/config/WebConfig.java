package ao.com.luandaaudiovisual.lua.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173",
                                 "http://localhost:3000", "http://127.0.0.1:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");

        // Necessário para que o <video>/<img> do frontend consiga carregar
        // os ficheiros servidos em /uploads/** a partir de outra origem.
        registry.addMapping("/uploads/**")
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173",
                                 "http://localhost:3000", "http://127.0.0.1:3000")
                .allowedMethods("GET", "OPTIONS");
    }

    // Serve fisicamente os ficheiros gravados pelo UploadController.
    // Sem isto, mesmo guardando o ficheiro em disco, o URL /uploads/...
    // devolveria 404, porque nenhum handler estava mapeado para essa pasta.
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Paths.toUri() codifica correctamente espaços e outros caracteres
        // especiais no caminho (ex.: pastas como "Cine Angola"). Construir
        // este URL por concatenação de texto (como estava antes) falha
        // sempre que o caminho do projecto contém um espaço.
        String location = Paths.get(uploadDir).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}