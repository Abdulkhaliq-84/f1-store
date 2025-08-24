using f1_store_api.Models;
using f1_store_api.Models.DTOs;

namespace f1_store_api.Services;

public interface IUserService
{
    Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(int id);
    Task<UserDto?> GetUserByEmailAsync(string email);
    Task<SignInResponseDto> SignInAsync(SignInDto signInDto);
}
