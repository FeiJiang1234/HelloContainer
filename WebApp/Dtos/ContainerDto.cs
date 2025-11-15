namespace HelloContainer.WebApp.Dtos;

public class ContainerDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Capacity { get; set; }
    public double Amount { get; set; }
    public List<Guid> ConnectedContainerIds { get; set; } = new();
    public double FillPercentage => Capacity > 0 ? Amount / Capacity : 0;
    public bool IsFull => FillPercentage >= 1.0;
    public Guid CreatedBy { get; set; }
    public string CreatedByName { get; set; }

}

