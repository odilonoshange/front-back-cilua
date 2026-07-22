package ao.com.luandaaudiovisual.lua.dto;

import jakarta.validation.constraints.NotBlank;

public record UserUpdateRequest

(   @NotBlank
    String name
) 
{}
