using f1_store_api.Services;
using f1_store_api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add SQLite Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=f1store.db"));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Add Swagger/OpenAPI services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "F1 Store API",
        Version = "v1",
        Description = "A comprehensive API for the F1 Store application",
        Contact = new OpenApiContact
        {
            Name = "F1 Store Team",
            Email = "support@f1store.com"
        }
    });
    
    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // React dev server URLs
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Initialize Database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Baseline migration history if schema already exists (from previous EnsureCreated runs)
    // This avoids errors like: SQLite Error 1: 'table "Products" already exists'.
    try
    {
        context.Database.ExecuteSqlRaw(@"
CREATE TABLE IF NOT EXISTS ""__EFMigrationsHistory"" (
    ""MigrationId"" TEXT NOT NULL CONSTRAINT ""PK___EFMigrationsHistory"" PRIMARY KEY,
    ""ProductVersion"" TEXT NOT NULL
);
INSERT INTO ""__EFMigrationsHistory"" (""MigrationId"", ""ProductVersion"")
SELECT '20250820133450_AddProductsTable', '9.0.8'
WHERE EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='Products')
  AND NOT EXISTS (SELECT 1 FROM ""__EFMigrationsHistory"" WHERE ""MigrationId"" = '20250820133450_AddProductsTable');
");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Warning: baselining migrations failed: {ex.Message}");
    }

    // Apply any pending migrations without deleting existing data
    context.Database.Migrate();
    Console.WriteLine("Database migrations applied");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "F1 Store API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "F1 Store API Documentation";
        c.DefaultModelsExpandDepth(-1); // Hide schemas section by default
        c.DisplayRequestDuration();
        c.EnableTryItOutByDefault();
    });
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Configure static file serving for uploaded images
app.UseStaticFiles();

app.UseCors("AllowFrontend");
app.UseAuthorization();

// Add root endpoint
app.MapGet("/", () => new
{
    name = "F1 Store API",
    version = "v1",
    status = "running",
    message = "Welcome to the F1 Store API",
            endpoints = new
        {
            swagger = "/swagger",
            health = "/health",
            users = "/api/users",
            products = "/api/products",
            cart = "/api/cart",
            orders = "/api/order"
        },
    timestamp = DateTime.UtcNow
});

// Add health check endpoint
app.MapGet("/health", () => new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName
});

app.MapControllers();

app.Run();
