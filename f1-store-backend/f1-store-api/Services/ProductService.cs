using f1_store_api.Data;
using f1_store_api.Models;
using f1_store_api.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace f1_store_api.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto, string? imagePath = null)
    {
        var product = new Product
        {
            ProductName = createProductDto.ProductName,
            Price = createProductDto.Price,
            Team = createProductDto.Team,
            Driver = createProductDto.Driver,
            Size = createProductDto.Size,
            Description = createProductDto.Description,
            ImagePath = imagePath,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _context.Products
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        return product != null ? MapToDto(product) : null;
    }

    public async Task<IEnumerable<ProductDto>> GetProductsByTeamAsync(string team)
    {
        var products = await _context.Products
            .Where(p => p.Team == team)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return products.Select(MapToDto);
    }

    public async Task<IEnumerable<ProductDto>> GetProductsByDriverAsync(string driver)
    {
        var products = await _context.Products
            .Where(p => p.Driver == driver)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return products.Select(MapToDto);
    }

    public async Task<ProductDto> UpdateProductAsync(int id, CreateProductDto updateProductDto, string? imagePath = null)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            throw new InvalidOperationException("Product not found");
        }

        product.ProductName = updateProductDto.ProductName;
        product.Price = updateProductDto.Price;
        product.Team = updateProductDto.Team;
        product.Driver = updateProductDto.Driver;
        product.Size = updateProductDto.Size;
        product.Description = updateProductDto.Description;
        
        if (imagePath != null)
        {
            product.ImagePath = imagePath;
        }
        
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return false;
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return true;
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            ProductName = product.ProductName,
            Price = product.Price,
            Team = product.Team,
            Driver = product.Driver,
            Size = product.Size,
            Description = product.Description,
            ImagePath = product.ImagePath,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}
