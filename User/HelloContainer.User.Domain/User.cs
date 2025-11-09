namespace HelloContainer.User.Domain
{
    public class User
    {
        public static User Create(Guid id, string name, string role)
        {
            return new User { Id = id, Name = name, Role = role };
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
    }
}
