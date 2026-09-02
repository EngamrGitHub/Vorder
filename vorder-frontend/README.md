# Vorder Frontend

React + Vite + TypeScript frontend for the Vorder WebAPI (multi-vendor e-commerce).

## Run

1. Start the API first (from the solution root):

   ```powershell
   # if only the .NET 10 runtime is installed:
   $env:DOTNET_ROLL_FORWARD='Major'
   dotnet run --project Vorder.WebAPI --urls http://localhost:5080
   ```

2. Start the frontend:

   ```powershell
   npm install   # first time only
   npm run dev
   ```

3. Open http://localhost:5173

The API base URL defaults to `http://localhost:5080`. Override it with a `.env` file:

```
VITE_API_URL=http://localhost:5080
```

## Covered API surface (every custom endpoint)

| Area | Endpoints |
|---|---|
| Authentication | Register, ConfirmEmail, Login, GoogleLogin, RefreshToken (auto via interceptor), ForgotPassword, ResetPassword, ResendConfirmationEmail |
| Shop | GetShops, GetPaginatedShops, GetShopByID, CreateShop, UpdateShop, DeleteShop, static `/shop-images/*` |
| Category | GetCategories, GetPaginatedCategories, GetCategoryByID, CreateCategory, UpdateCategory, DeleteCategory |
| SubCategory | GetSubCategories, GetPaginatedSubCategories, GetSubCategoryByID, GetSubCategoryByCategoryID, CreateSubCategory, UpdateSubCategory, DeleteSubCategory |
| Product | GetProducts, GetPaginatedProducts, GetProductByID, CreateProduct, UpdateProduct, DeleteProduct |
| ShoppingCart | AddToCart, GetMyCart |
| Order | CreateOrder, GetOrderById |
| Payment | ProcessPayment, GetOrderPayments |
| Review | CreateReview, GetProductReviews |
| Address | AddAddress, GetUserAddresses |

## Conventions the frontend respects

- All responses use the `{ errorMsg, errorCode, isSuccess, result }` envelope; HTTP errors are surfaced as the same shape.
- `UpdateShop` and `UpdateProduct` are sent as **multipart/form-data** (their DTOs contain `IFormFile` → ASP.NET Core binds them from form).
- `CreateCategory` / `CreateProduct` are **multipart** (`[FromForm]`), `CreateSubCategory` is **JSON**.
- Shop-scoped endpoints send the tenant via the `X-Shop-ID` header (mirrors the API's `CurrentUserService` header fallback).
- JWTs are attached automatically; on 401 the app transparently calls `RefreshToken` and retries once.
- Image files validate server-side by magic bytes (JPEG/PNG/GIF/BMP).
