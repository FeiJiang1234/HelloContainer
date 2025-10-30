using HelloContainer.User.Application.Dtos;
using Microsoft.AspNetCore.Mvc;
using Todo.Application;

namespace HelloContainer.User.API.Controllers
{
    [ApiController]
    [Route("api/[controller]s")]
    public class UserController : Controller
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<UserReadDto>> GetUsers()
        {
            return await _userService.GetUsers();
        }

        [HttpGet("id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<UserReadDto> GetUser([FromRoute] Guid id)
        {
            return null;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<UserReadDto>> CreateTodo([FromBody] UserWriteDto writeDto)
        {
            var todo = await _userService.CreateUser(writeDto.name);
            return CreatedAtAction(nameof(GetUser), todo);
        }
    }
}
