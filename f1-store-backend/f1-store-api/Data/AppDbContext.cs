using Microsoft.EntityFrameworkCore;
using f1_store_api.Models;

namespace f1_store_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.PhoneNumber)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(e => e.ProfilePhotoPath)
                .HasMaxLength(500); // For file path storage

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();

            // Unique constraints
            entity.HasIndex(e => e.Email)
                .IsUnique();

            entity.HasIndex(e => e.Username)
                .IsUnique();
        });

        // Configure Product entity
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.ProductName)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Price)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            entity.Property(e => e.Team)
                .HasMaxLength(100);

            entity.Property(e => e.Driver)
                .HasMaxLength(100);

            entity.Property(e => e.Size)
                .HasMaxLength(10);

            entity.Property(e => e.Description)
                .HasMaxLength(1000);

            entity.Property(e => e.ImagePath)
                .HasMaxLength(500);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();
        });

        // Configure Cart entity
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();

            // Foreign key relationship with User
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many relationship with CartItems
            entity.HasMany(e => e.CartItems)
                .WithOne(ci => ci.Cart)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure CartItem entity
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.CartId)
                .IsRequired();

            entity.Property(e => e.ProductId)
                .IsRequired();

            entity.Property(e => e.Quantity)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();

            // Foreign key relationship with Product
            entity.HasOne(e => e.Product)
                .WithMany()
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint for cart and product combination
            entity.HasIndex(e => new { e.CartId, e.ProductId })
                .IsUnique();
        });

        // Configure Order entity
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId)
                .IsRequired();

            entity.Property(e => e.OrderNumber)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.TotalAmount)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.ShippingAddress)
                .HasMaxLength(200);

            entity.Property(e => e.ShippingCity)
                .HasMaxLength(100);

            entity.Property(e => e.ShippingPostalCode)
                .HasMaxLength(20);

            entity.Property(e => e.ShippingCountry)
                .HasMaxLength(100);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired();

            // Foreign key relationship with User
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many relationship with OrderItems
            entity.HasMany(e => e.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint for order number
            entity.HasIndex(e => e.OrderNumber)
                .IsUnique();
        });

        // Configure OrderItem entity
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.OrderId)
                .IsRequired();

            entity.Property(e => e.ProductId)
                .IsRequired();

            entity.Property(e => e.Quantity)
                .IsRequired();

            entity.Property(e => e.UnitPrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            entity.Property(e => e.TotalPrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            // Foreign key relationship with Product
            entity.HasOne(e => e.Product)
                .WithMany()
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
