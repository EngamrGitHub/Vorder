# Vorder

Multi-vendor e-commerce platform: shops, categories, subcategories, products, cart, orders, payments, reviews and addresses.

## Repository layout

| Folder | Description |
|---|---|
| `VorderShops/` | ASP.NET Core 9/10 Web API (Clean Architecture: Domain, Application, Infrastructure, WebAPI) + Docker support |
| `vorder-frontend/` | React + Vite + TypeScript frontend covering every API endpoint |

## Run the backend

```powershell
cd VorderShops
dotnet run --project Vorder.WebAPI --urls http://localhost:5080
```

- Swagger UI: http://localhost:5080/
- Database: SQL Server (connection string in `VorderShops/Vorder.WebAPI/appsettings.json`)
- Apply migrations: `dotnet ef database update --project Vorder.Infrastructure --startup-project Vorder.WebAPI`

## Run the frontend

```powershell
cd vorder-frontend
npm install
npm run dev
```

- Opens on http://localhost:5173
- API base URL defaults to http://localhost:5080 (override with `VITE_API_URL` in `.env`)
- Optional: set `VITE_GOOGLE_CLIENT_ID` in `.env` to enable Google sign-in

## Features

- Authentication: register, email confirmation, login, JWT + refresh tokens, forgot/reset password, Google login
- Shop ownership: create/update/delete your shop with logo, banner and favicon
- Catalog: categories, subcategories, products (images, discounts, stock, SKU)
- Shopping: cart, checkout with shipping details, orders, payments
- Customer: product reviews with star ratings, saved address book

