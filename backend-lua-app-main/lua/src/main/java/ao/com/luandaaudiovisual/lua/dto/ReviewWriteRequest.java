package ao.com.luandaaudiovisual.lua.dto;

public record ReviewWriteRequest
(
    Long userId,
    String commentary,
    Integer rating
) 
{}
