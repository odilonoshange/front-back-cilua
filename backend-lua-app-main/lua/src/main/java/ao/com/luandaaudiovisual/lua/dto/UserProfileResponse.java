package ao.com.luandaaudiovisual.lua.dto;

import ao.com.luandaaudiovisual.lua.model.UserRole;

public record UserProfileResponse
(
    Long id,
    String name,
    String email,
    UserRole role
) 
{}
