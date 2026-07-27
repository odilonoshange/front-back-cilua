package ao.com.luandaaudiovisual.lua.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReviewWriteRequest(
        @NotNull(message = "defina o utilizador")
        Long userId,

        String commentary,

        @NotNull(message = "defina a classificação")
        @Min(value = 1, message = "a classificação mínima é 1")
        @Max(value = 5, message = "a classificação máxima é 5")
        Integer rating
) {}
