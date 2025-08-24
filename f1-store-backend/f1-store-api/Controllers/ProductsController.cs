using Microsoft.AspNetCore.Mvc;
using f1_store_api.Models.DTOs;
using f1_store_api.Services;

namespace f1_store_api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IWebHostEnvironment _environment;

    public ProductsController(IProductService productService, IWebHostEnvironment environment)
    {
        _productService = productService;
        _environment = environment;
    }

    /// <summary>
    /// Create a new product with optional image upload
    /// </summary>
    /// <param name="createProductDto">Product data and optional image</param>
    /// <returns>Created product information</returns>
    /// <response code="201">Product created successfully</response>
    /// <response code="400">Invalid request data</response>
    /// <response code="500">Internal server error</response>
    [HttpPost]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromForm] CreateProductDto createProductDto)
    {
        // Log request details
        Console.WriteLine($"=== CREATE PRODUCT REQUEST ===");
        Console.WriteLine($"Request method: {Request.Method}");
        Console.WriteLine($"Request URL: {Request.Path}");
        Console.WriteLine($"Content-Type: {Request.ContentType}");
        Console.WriteLine($"Content-Length: {Request.ContentLength}");
        
        // Log the received data for debugging
        Console.WriteLine($"Received ProductName: '{createProductDto.ProductName}' (Length: {createProductDto.ProductName?.Length ?? 0})");
        Console.WriteLine($"Received Price: {createProductDto.Price}");
        Console.WriteLine($"Received Team: '{createProductDto.Team}' (Length: {createProductDto.Team?.Length ?? 0})");
        Console.WriteLine($"Received Driver: '{createProductDto.Driver}' (Length: {createProductDto.Driver?.Length ?? 0})");
        Console.WriteLine($"Received Size: '{createProductDto.Size}' (Length: {createProductDto.Size?.Length ?? 0})");
        Console.WriteLine($"Received Description: '{createProductDto.Description}' (Length: {createProductDto.Description?.Length ?? 0})");
        Console.WriteLine($"Received Image: {(createProductDto.Image != null ? createProductDto.Image.FileName : "null")}");
        
        // Log ModelState keys
        Console.WriteLine("ModelState keys:");
        foreach (var key in ModelState.Keys)
        {
            var entry = ModelState[key];
            Console.WriteLine($"  - {key}: Valid={entry.ValidationState}, Errors={entry.Errors.Count}");
        }
        
        if (!ModelState.IsValid)
        {
            Console.WriteLine("ModelState is invalid:");
            foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
            {
                Console.WriteLine($"  - {error.ErrorMessage}");
            }
            Response.Headers.Add("Content-Type", "application/json");
            return BadRequest(new { message = "Validation failed", errors = ModelState });
        }

        try
        {
            string? imagePath = null;
            
            // Handle image upload if provided
            if (createProductDto.Image != null)
            {
                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var extension = Path.GetExtension(createProductDto.Image.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                {
                    Response.Headers.Add("Content-Type", "application/json");
                    return BadRequest(new { message = "Only image files (jpg, jpeg, png, webp) are allowed" });
                }

                // Validate file size (max 5MB)
                if (createProductDto.Image.Length > 5 * 1024 * 1024)
                {
                    Response.Headers.Add("Content-Type", "application/json");
                    return BadRequest(new { message = "File size cannot exceed 5MB" });
                }

                // Create uploads directory if it doesn't exist
                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "products");
                Directory.CreateDirectory(uploadsPath);

                // Generate unique filename
                var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsPath, uniqueFileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await createProductDto.Image.CopyToAsync(stream);
                }

                // Set relative path for database storage
                imagePath = $"/uploads/products/{uniqueFileName}";
            }

            var product = await _productService.CreateProductAsync(createProductDto, imagePath);
            Console.WriteLine($"Product created successfully with ID: {product.Id}");
            Console.WriteLine($"Returning product: {System.Text.Json.JsonSerializer.Serialize(product)}");
            
            // Ensure response has content
            var responseBody = System.Text.Json.JsonSerializer.Serialize(product);
            Console.WriteLine($"Response body length: {responseBody.Length}");
            Console.WriteLine($"Response body: {responseBody}");
            
            Response.Headers.Add("Content-Type", "application/json");
            Response.Headers.Add("Content-Length", responseBody.Length.ToString());
            return StatusCode(201, product);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception occurred while creating product: {ex.Message}");
            Console.WriteLine($"Exception stack trace: {ex.StackTrace}");
            Response.Headers.Add("Content-Type", "application/json");
            return StatusCode(500, new { message = "An error occurred while creating the product", details = ex.Message });
        }
    }



    /// <summary>
    /// Get all products
    /// </summary>
    /// <returns>List of all products</returns>
    /// <response code="200">Products retrieved successfully</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        try
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving products", details = ex.Message });
        }
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product information</returns>
    /// <response code="200">Product found and returned</response>
    /// <response code="404">Product not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }
            return Ok(product);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the product", details = ex.Message });
        }
    }

    /// <summary>
    /// Get products by team
    /// </summary>
    /// <param name="team">Team name</param>
    /// <returns>List of products for the specified team</returns>
    /// <response code="200">Products retrieved successfully</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("team/{team}")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByTeam(string team)
    {
        try
        {
            var products = await _productService.GetProductsByTeamAsync(team);
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving products by team", details = ex.Message });
        }
    }

    /// <summary>
    /// Get products by driver
    /// </summary>
    /// <param name="driver">Driver name</param>
    /// <returns>List of products for the specified driver</returns>
    /// <response code="200">Products retrieved successfully</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("driver/{driver}")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByDriver(string driver)
    {
        try
        {
            var products = await _productService.GetProductsByDriverAsync(driver);
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving products by driver", details = ex.Message });
        }
    }

    /// <summary>
    /// Update product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="updateProductDto">Updated product data</param>
    /// <returns>Updated product information</returns>
    /// <response code="200">Product updated successfully</response>
    /// <response code="400">Invalid request data</response>
    /// <response code="404">Product not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] CreateProductDto updateProductDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var product = await _productService.UpdateProductAsync(id, updateProductDto);
            return Ok(product);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the product", details = ex.Message });
        }
    }

    /// <summary>
    /// Delete product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Deletion result</returns>
    /// <response code="200">Product deleted successfully</response>
    /// <response code="404">Product not found</response>
    /// <response code="500">Internal server error</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<object>> DeleteProduct(int id)
    {
        try
        {
            var result = await _productService.DeleteProductAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Product not found" });
            }

            return Ok(new { message = "Product deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the product", details = ex.Message });
        }
    }
}
