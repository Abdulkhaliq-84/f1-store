using Microsoft.AspNetCore.Mvc;
using f1_store_api.Models.DTOs;
using f1_store_api.Services;

namespace f1_store_api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="createUserDto">User registration data</param>
    /// <returns>Created user information</returns>
    /// <response code="201">User created successfully</response>
    /// <response code="400">Invalid request data</response>
    /// <response code="409">User already exists</response>
    /// <response code="500">Internal server error</response>
    [HttpPost]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var user = await _userService.CreateUserAsync(createUserDto);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the user", details = ex.Message });
        }
    }

    /// <summary>
    /// Get all users
    /// </summary>
    /// <returns>List of all users</returns>
    /// <response code="200">Users retrieved successfully</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving users", details = ex.Message });
        }
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User information</returns>
    /// <response code="200">User found and returned</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the user", details = ex.Message });
        }
    }

    /// <summary>
    /// User sign in
    /// </summary>
    /// <param name="signInDto">Sign in credentials</param>
    /// <returns>Sign in result with user information and token</returns>
    /// <response code="200">Sign in successful</response>
    /// <response code="400">Invalid request data</response>
    /// <response code="401">Invalid credentials</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("signin")]
    [ProducesResponseType(typeof(SignInResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<SignInResponseDto>> SignIn([FromBody] SignInDto signInDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _userService.SignInAsync(signInDto);
            
            if (!result.Success)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during sign in", details = ex.Message });
        }
    }
}
