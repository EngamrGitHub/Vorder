using FluentValidation;
using FluentValidation.Results;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Vorder.Application.DTOs.ProductDtos;
using Vorder.Application.Interfaces;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Entities;
using Vorder.WebAPI.Helpers;

namespace Vorder.WebAPI.Controllers.ProductAPIs
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProductController(ICurrentUserService currentUser, IProductRepository productRepository, IValidator<CreateProductDto> CreateProductValidator, IValidator<Product> productValidator) : ControllerBase
    {


        [HttpGet(Name = "GetPaginatedProducts")]
        public async Task<ActionResult<ApplicationResult<List<ResponseProductDto>>>> GetPaginatedProducts(int PageNumber, int PageSize)
        {
            Guid ShopID;
            try
            {
                ShopID = currentUser.GetTenantId();
            }
            catch (UnauthorizedAccessException)
            {
                return ApiResponseStatus.BadRequest<List<ResponseProductDto>>(Errors.ValidationError("Invalid Shop ID"));
            }

            var products = await productRepository.GetPagedAsync(PageNumber, PageSize, ShopID);
            List<ResponseProductDto> productsList = [];
            foreach (var product in products)
            {
                productsList.Add(product.Adapt<ResponseProductDto>());
            }
            return ApiResponseStatus.Ok<List<ResponseProductDto>>(productsList);
        }


        [HttpGet(Name = "GetProducts")]
        public async Task<ActionResult<ApplicationResult<List<ResponseProductDto>>>> GetProducts()
        {
            Guid ShopID;
            try
            {
                ShopID = currentUser.GetTenantId();
            }
            catch (UnauthorizedAccessException)
            {
                return ApiResponseStatus.BadRequest<List<ResponseProductDto>>(Errors.ValidationError("Invalid Shop ID"));
            }

            var Products = await productRepository.GetAllAsync(ShopID);
            List<ResponseProductDto> ProductsList = [];
            foreach (var product in Products)
            {
                ProductsList.Add(product.Adapt<ResponseProductDto>());
            }
            return ApiResponseStatus.Ok<List<ResponseProductDto>>(ProductsList);
        }


        [HttpGet(Name = "GetProductByID")]
        public async Task<ActionResult<ApplicationResult<ResponseProductDto>>> GetProductByID(Guid ProductID)
        {
            var Product = await productRepository.GetByIdAsync(ProductID);
            if (Product is null)
            {
                return ApiResponseStatus.NotFound<ResponseProductDto>(Errors.NotFound(ErrorConstants.PRODUCTNOTFOUND, ErrorConstants.PRODUCTNOTFOUNDCODE));
            }

            return ApiResponseStatus.Ok<ResponseProductDto>(Product.Adapt<ResponseProductDto>());
        }

        [HttpPost(Name = "CreateProduct")]
        public async Task<ActionResult<ApplicationResult<ResponseProductDto>>> CreateProduct([FromForm] CreateProductDto createProductDto)
        {
            Guid ShopID;
            try
            {
                ShopID = currentUser.GetTenantId();
            }
            catch (UnauthorizedAccessException)
            {
                return ApiResponseStatus.BadRequest<ResponseProductDto>(Errors.ValidationError("Invalid Shop ID"));
            }
            ValidationResult validationResult = CreateProductValidator.Validate(createProductDto);

            if (!validationResult.IsValid)
            {
                string ErrorMsg = string.Join("; ",
                                    validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}"));

                return ApiResponseStatus.BadRequest<ResponseProductDto>(Errors.ValidationError(errorMsg: ErrorMsg));
            }

            try
            {
                createProductDto.ImageUrl = await ImageHelper.SaveImageAsync(createProductDto.Image);
            }
            catch (InvalidDataException e)
            {
                return ApiResponseStatus.BadRequest<ResponseProductDto>(Errors.ValidationError("Cant convert this type to image", e.Message));
            }
            Product product = createProductDto.Adapt<Product>();
            // Note: Product belongs to a shop via SubCategory -> Category -> ShopID chain
            // Guard NOT NULL columns against optional fields missing in the request
            product.Name ??= string.Empty;
            product.Description ??= string.Empty;
            product.SKU ??= string.Empty;
            product.Brand ??= string.Empty;
            product.Model ??= string.Empty;
            product.ImageUrl ??= string.Empty;

            await productRepository.AddAsync(product);
            await productRepository.SaveChangesAsync();

            return ApiResponseStatus.Created<ResponseProductDto>(product.Adapt<ResponseProductDto>());
        }


        [HttpPatch("{id:guid}", Name = "UpdateProduct")]
        public async Task<ActionResult<ApplicationResult<ResponseProductDto>>> UpdateProduct(Guid id, UpdateProductDto productDto)
        {
            Product? existingProduct = await productRepository.GetByIdAsync(id);
            if (existingProduct is null)
                return ApiResponseStatus.NotFound<ResponseProductDto>(Errors.NotFound(ErrorConstants.PRODUCTNOTFOUND, ErrorConstants.PRODUCTNOTFOUNDCODE));


            try
            {
                if (productDto.Image is not null)
                {
                    productDto.ImageUrl = await ImageHelper.SaveImageAsync(productDto.Image);
                    ImageHelper.DeleteImage(existingProduct.ImageUrl);
                }
            }
            catch (InvalidDataException e)
            {
                return ApiResponseStatus.NotFound<ResponseProductDto>(Errors.ValidationError("Cant convert this type to image", e.Message));
            }

            productDto.Adapt(existingProduct);

            ValidationResult validationResult = productValidator.Validate(existingProduct);

            if (!validationResult.IsValid)
            {
                string ErrorMsg = string.Join("; ",
                                    validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}"));

                return ApiResponseStatus.BadRequest<ResponseProductDto>(Errors.ValidationError(errorMsg: ErrorMsg));
            }

            productRepository.Update(existingProduct);
            await productRepository.SaveChangesAsync();

            return ApiResponseStatus.Ok<ResponseProductDto>(existingProduct.Adapt<ResponseProductDto>());
        }


        [HttpDelete("{id:guid}", Name = "DeleteProduct")]
        public async Task<ActionResult<ApplicationResult<string>>> DeleteProduct(Guid id)
        {
            Product? existingProduct = await productRepository.GetByIdAsync(id);
            if (existingProduct is null)
                return ApiResponseStatus.NotFound<string>(Errors.NotFound(ErrorConstants.PRODUCTNOTFOUND, ErrorConstants.PRODUCTNOTFOUNDCODE));

            productRepository.Delete(existingProduct);
            await productRepository.SaveChangesAsync();

            return ApiResponseStatus.Ok<string>("Product Deleted Successfully");
        }


    }
}
