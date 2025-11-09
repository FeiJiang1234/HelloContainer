using HelloContainer.User.Application.Dtos;
using HelloContainer.User.Domain;
using Todo.Domain.Abstractions;

namespace Todo.Application
{
    public class UserService
    {
        private readonly IUnitOfWork _uow;
        private readonly IUserRepository _userRepository;

        public UserService(IUnitOfWork uow, IUserRepository userRepository)
        {
            _uow = uow;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserReadDto>> GetUsers()
        {
            var users = await _userRepository.GetAll();
            return users.Select(x => new UserReadDto(x.Id, x.Name, x.Role));
        }

        public async Task<UserReadDto?> GetUser(Guid id)
        {
            var user = await _userRepository.GetAsync(u => u.Id == id);
            return user == null ? null : new UserReadDto(user.Id, user.Name, user.Role);
        }

        public async Task<UserReadDto> CreateUser(Guid id, string name, string role)
        {
            var user = User.Create(id, name, role);
            _userRepository.Add(user);
            await _uow.SaveChangesAsync();

            return new UserReadDto(user.Id, user.Name, user.Role);
        }
    }
}
