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
            return users.Select(x => new UserReadDto(x.Id, x.Name));
        }

        public async Task<UserReadDto> CreateUser(string title)
        {
            var user = User.Create(title);
            _userRepository.Add(user);
            await _uow.SaveChangesAsync();

            return new UserReadDto(user.Id, user.Name);
        }
    }
}
