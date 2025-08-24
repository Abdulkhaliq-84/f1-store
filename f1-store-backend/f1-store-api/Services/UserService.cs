using f1_store_api.Models;
using f1_store_api.Models.DTOs;
using f1_store_api.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace f1_store_api.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == createUserDto.Email.ToLower()))
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == createUserDto.Username.ToLower()))
        {
            throw new InvalidOperationException("Username is already taken");
        }

        // Hash password
        var passwordHash = HashPassword(createUserDto.Password);

        var user = new User
        {
            Username = createUserDto.Username,
            Email = createUserDto.Email,
            PhoneNumber = createUserDto.PhoneNumber,
            PasswordHash = passwordHash,
            ProfilePhotoPath = createUserDto.ProfilePhotoPath,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            ProfilePhotoPath = user.ProfilePhotoPath,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _context.Users.ToListAsync();
        
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            PhoneNumber = u.PhoneNumber,
            ProfilePhotoPath = u.ProfilePhotoPath,
            CreatedAt = u.CreatedAt
        });
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            ProfilePhotoPath = user.ProfilePhotoPath,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            ProfilePhotoPath = user.ProfilePhotoPath,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<SignInResponseDto> SignInAsync(SignInDto signInDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == signInDto.Email.ToLower());
        
        if (user == null)
        {
            return new SignInResponseDto
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        if (!VerifyPassword(signInDto.Password, user.PasswordHash))
        {
            return new SignInResponseDto
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        return new SignInResponseDto
        {
            Success = true,
            Message = "Sign in successful",
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                ProfilePhotoPath = user.ProfilePhotoPath,
                CreatedAt = user.CreatedAt
            },
            Token = GenerateToken(user) // Simple token for demonstration
        };
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "salt"));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string password, string hash)
    {
        var passwordHash = HashPassword(password);
        return passwordHash == hash;
    }

    private string GenerateToken(User user)
    {
        // Simple token generation for demonstration
        // In production, use JWT or similar
        return Convert.ToBase64String(Encoding.UTF8.GetBytes($"{user.Id}:{user.Email}:{DateTime.UtcNow:yyyy-MM-dd-HH-mm-ss}"));
    }
}
