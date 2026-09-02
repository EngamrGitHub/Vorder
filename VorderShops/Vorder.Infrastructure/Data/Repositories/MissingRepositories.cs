using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class MembershipRepository(ApplicationDbContext context) : GenericRepository<Membership>(context), IMembershipRepository { }
    public class DepartmentRepository(ApplicationDbContext context) : GenericRepository<Department>(context), IDepartmentRepository { }
    public class ShipperRepository(ApplicationDbContext context) : GenericRepository<Shipper>(context), IShipperRepository { }
    public class DiscountRepository(ApplicationDbContext context) : GenericRepository<Discount>(context), IDiscountRepository { }
    public class OfferRepository(ApplicationDbContext context) : GenericRepository<Offer>(context), IOfferRepository { }
    public class WishlistRepository(ApplicationDbContext context) : GenericRepository<Wishlist>(context), IWishlistRepository { }
    public class ShoppingCartItemRepository(ApplicationDbContext context) : GenericRepository<ShoppingCartItem>(context), IShoppingCartItemRepository { }
}
