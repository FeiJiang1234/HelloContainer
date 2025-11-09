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

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserReadDto?>> GetUser([FromRoute] Guid id)
        {
            var user = await _userService.GetUser(id);
            return user;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<UserReadDto>> Create([FromBody] UserWriteDto writeDto)
        {
            var user = await _userService.CreateUser(writeDto.id, writeDto.name, writeDto.role);
            return CreatedAtAction(nameof(GetUser), new { id = user.id }, user);
        }
    }
}
