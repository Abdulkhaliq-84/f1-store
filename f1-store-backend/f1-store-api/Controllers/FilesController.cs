using Microsoft.AspNetCore.Mvc;

namespace f1_store_api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Files")]
public class FilesController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<FilesController> _logger;

    public FilesController(IWebHostEnvironment environment, ILogger<FilesController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    /// <summary>
    /// Upload a profile photo
    /// </summary>
    /// <param name="file">Image file to upload</param>
    /// <returns>File path of uploaded image</returns>
    /// <response code="200">File uploaded successfully</response>
    /// <response code="400">Invalid file or request</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("upload-profile-photo")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UploadProfilePhoto(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file provided" });
            }

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Only image files (jpg, jpeg, png, webp) are allowed" });
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "File size cannot exceed 5MB" });
            }

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "profile-photos");
            Directory.CreateDirectory(uploadsPath);

            // Generate unique filename
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, uniqueFileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative path for database storage
            var relativePath = $"/uploads/profile-photos/{uniqueFileName}";
            
            _logger.LogInformation("Profile photo uploaded successfully: {FilePath}", relativePath);

            return Ok(new { 
                message = "File uploaded successfully", 
                filePath = relativePath,
                fileName = uniqueFileName
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading profile photo");
            return StatusCode(500, new { message = "An error occurred while uploading the file", details = ex.Message });
        }
    }

    /// <summary>
    /// Delete a profile photo
    /// </summary>
    /// <param name="fileName">Name of the file to delete</param>
    /// <returns>Deletion result</returns>
    [HttpDelete("profile-photo/{fileName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult DeleteProfilePhoto(string fileName)
    {
        try
        {
            var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "profile-photos");
            var filePath = Path.Combine(uploadsPath, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "File not found" });
            }

            System.IO.File.Delete(filePath);
            
            _logger.LogInformation("Profile photo deleted successfully: {FileName}", fileName);

            return Ok(new { message = "File deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting profile photo: {FileName}", fileName);
            return StatusCode(500, new { message = "An error occurred while deleting the file", details = ex.Message });
        }
    }
}
