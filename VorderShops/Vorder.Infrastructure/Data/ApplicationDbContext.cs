using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Vorder.Application.Interfaces;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data
{
    public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ICurrentUserService _currentUserService) : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>().ToTable("Product");
            modelBuilder.Entity<Product>().HasQueryFilter(p => p.IsDeleted == false);
            modelBuilder.Entity<Shop>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Name).IsUnique();

                entity.HasOne(e => e.Owner)
                      .WithMany()
                      .HasForeignKey(e => e.OwnerId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(e => e.Creator)
                      .WithMany()
                      .HasForeignKey(e => e.CreatorId)
                      .OnDelete(DeleteBehavior.NoAction);
                entity.HasOne(e => e.LastModifier)
                      .WithMany()
                      .HasForeignKey(e => e.LastModifierId)
                      .OnDelete(DeleteBehavior.NoAction);
            });
            modelBuilder.Entity<Shop>().HasQueryFilter(c => !c.IsDeleted);

            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.HasOne(e => e.Shop)
                      .WithMany()
                      .HasForeignKey(e => e.ShopID)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(e => e.Membership)
                      .WithMany()
                      .HasForeignKey(e => e.MembershipId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Membership>(entity =>
            {
                entity.HasOne(e => e.Creator)
                      .WithMany()
                      .HasForeignKey(e => e.CreatorId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(e => e.LastModifier)
                      .WithMany()
                      .HasForeignKey(e => e.LastModifierId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Categories");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.HasIndex(e => e.Name)
                      .IsUnique();

                entity.Property(e => e.AppearsInHeader)
                      .HasDefaultValue(false);

                entity.Property(e => e.IsFeatured)
                      .HasDefaultValue(false);

                //entity.HasOne(e => e.Creator)
                //      .WithMany()
                //      .HasForeignKey(e => e.CreatorId)
                //      .OnDelete(DeleteBehavior.NoAction);

                //entity.HasOne(e => e.Shop)
                //      .WithMany()
                //      .HasForeignKey(e => e.ShopID)
                //      .OnDelete(DeleteBehavior.NoAction);

                //entity.HasOne(e => e.LastModifier)
                //      .WithMany()
                //      .HasForeignKey(e => e.LastModifierId)
                //      .OnDelete(DeleteBehavior.NoAction);
            });
            modelBuilder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);

            modelBuilder.Entity<SubCategory>(entity =>
            {
                entity.ToTable("SubCategories");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.HasIndex(e => e.Name)
                      .IsUnique();

                entity.Property(e => e.IsFeatured)
                      .HasDefaultValue(false);

                //entity.HasOne(e => e.Category)
                //      .WithMany(c => c.SubCategories)
                //      .HasForeignKey(e => e.CategoryId)
                //      .OnDelete(DeleteBehavior.NoAction);

                // Audit
                //entity.HasOne(e => e.Creator)
                //      .WithMany()
                //      .HasForeignKey(e => e.CreatorId)
                //      .OnDelete(DeleteBehavior.NoAction);

                //entity.HasOne(e => e.Shop)
                //      .WithMany()
                //      .HasForeignKey(e => e.ShopID)
                //      .OnDelete(DeleteBehavior.NoAction);

                //entity.HasOne(e => e.LastModifier)
                //      .WithMany()
                //      .HasForeignKey(e => e.LastModifierId)
                //      .OnDelete(DeleteBehavior.NoAction);
            });
            modelBuilder.Entity<SubCategory>().HasQueryFilter(c => !c.IsDeleted);

            modelBuilder.Entity<Membership>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Department>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Shipper>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Discount>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Address>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Order>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<OrderItem>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Payment>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Review>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Offer>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Wishlist>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ShoppingCartItem>().HasQueryFilter(e => !e.IsDeleted);
        }

        public DbSet<Shop> Shops { get; set; }
        public DbSet<RequestLog> RequestLogs { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Shipper> Shippers { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is BaseProperties && (e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted));
            var userId = _currentUserService?.UserId;

            foreach (var entry in entries)
            {
                var entity = (BaseProperties)entry.Entity;
                var now = DateTime.UtcNow;
                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.IsDeleted = false;
                    entity.IsActive = true;
                    entity.CreatorId = userId;
                }
                else
                {
                    entity.UpdatedDate = now;
                    entity.LastModifierId = userId;
                }
            }
            return await base.SaveChangesAsync(cancellationToken);
        }
    }

}
