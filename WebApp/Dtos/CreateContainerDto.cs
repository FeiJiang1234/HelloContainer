using System.ComponentModel.DataAnnotations;

namespace HelloContainer.WebApp.Dtos;

public class CreateContainerDto
{
    [Required(ErrorMessage = "Container name is required")]
    [StringLength(100, ErrorMessage = "Container name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Capacity is required")]
    [Range(0.1, double.MaxValue, ErrorMessage = "Capacity must be greater than 0")]
    public decimal Capacity { get; set; }
}

