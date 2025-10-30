namespace HelloContainer.User.Domain
{
    public class User
    {
        public static User Create(string name)
        {
            return new User { Name = name };
        }

        public Guid Id { get; set; }

        public string Name { get; set; }
    }
}
