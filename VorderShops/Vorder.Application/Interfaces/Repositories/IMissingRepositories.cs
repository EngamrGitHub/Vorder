using Vorder.Domain.Entities;

namespace Vorder.Application.Interfaces.Repositories
{
    public interface IMembershipRepository : IGenericRepository<Membership> { }
    public interface IDepartmentRepository : IGenericRepository<Department> { }
    public interface IShipperRepository : IGenericRepository<Shipper> { }
    public interface IDiscountRepository : IGenericRepository<Discount> { }
    public interface IOfferRepository : IGenericRepository<Offer> { }
    public interface IWishlistRepository : IGenericRepository<Wishlist> { }
    public interface IShoppingCartItemRepository : IGenericRepository<ShoppingCartItem> { }
}
