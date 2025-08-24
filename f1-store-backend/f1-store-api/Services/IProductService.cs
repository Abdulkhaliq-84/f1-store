using f1_store_api.Models.DTOs;

namespace f1_store_api.Services;

public interface IProductService
{
    Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto, string? imagePath = null);
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<IEnumerable<ProductDto>> GetProductsByTeamAsync(string team);
    Task<IEnumerable<ProductDto>> GetProductsByDriverAsync(string driver);
    Task<ProductDto> UpdateProductAsync(int id, CreateProductDto updateProductDto, string? imagePath = null);
    Task<bool> DeleteProductAsync(int id);
}
