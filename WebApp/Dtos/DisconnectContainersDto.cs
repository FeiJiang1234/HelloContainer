namespace HelloContainer.WebApp.Dtos
{
    public record DisconnectContainersDto(Guid SourceContainerId, Guid TargetContainerId);
}
