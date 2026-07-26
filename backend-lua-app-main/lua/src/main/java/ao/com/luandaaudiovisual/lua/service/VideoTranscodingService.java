package ao.com.luandaaudiovisual.lua.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class VideoTranscodingService {
    private final String ffmpegCommand;

    public VideoTranscodingService(@Value("${ffmpeg.command:ffmpeg}") String ffmpegCommand) {
        this.ffmpegCommand = ffmpegCommand;
    }

    public Path transcodeToWebMp4(Path input, Path outputDirectory) throws IOException, InterruptedException {
        Files.createDirectories(outputDirectory);
        Path output = outputDirectory.resolve(UUID.randomUUID() + ".mp4");

        Process process = new ProcessBuilder(
                ffmpegCommand,
                "-y",
                "-i", input.toAbsolutePath().toString(),
                "-c:v", "libx264",
                "-preset", "veryfast",
                "-crf", "23",
                "-pix_fmt", "yuv420p",
                "-c:a", "aac",
                "-b:a", "128k",
                "-movflags", "+faststart",
                output.toAbsolutePath().toString()
        ).redirectErrorStream(true).start();

        String processOutput = new String(process.getInputStream().readAllBytes());
        int exitCode = process.waitFor();

        if (exitCode != 0 || !Files.exists(output) || Files.size(output) == 0) {
            Files.deleteIfExists(output);
            throw new IOException("Falha ao processar o vídeo com FFmpeg: " + processOutput);
        }

        return output;
    }

    public void deleteQuietly(Path file) {
        try {
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
        }
    }
}
