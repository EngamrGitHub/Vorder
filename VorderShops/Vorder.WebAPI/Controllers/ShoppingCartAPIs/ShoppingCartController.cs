using Mapster;
using Microsoft.AspNetCore.Mvc;
using Vorder.Application.DTOs.ShoppingCartDtos;
using Vorder.Application.Interfaces;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Entities;
using Vorder.WebAPI.Helpers;

namespace Vorder.WebAPI.Controllers.ShoppingCartAPIs
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class ShoppingCartController(
        ICurrentUserService currentUser, 
        IShoppingCartItemRepository cartRepo) : ControllerBase
    {
        [HttpPost(Name = "AddToCart")]
        public async Task<ActionResult<ApplicationResult<string>>> AddToCart(AddToCartDto cartDto)
        {
            var userId = currentUser.UserId;
            if (userId == null || userId == Guid.Empty)
                return ApiResponseStatus.BadRequest<string>(Errors.ValidationError("Invalid User"));

            var existingItem = (await cartRepo.FindAllAsync(c => c.UserId == userId.Value && c.ProductId == cartDto.ProductId)).FirstOrDefault();
            
            if (existingItem != null)
            {
                existingItem.Quantity += cartDto.Quantity;
                cartRepo.Update(existingItem);
            }
            else
            {
                var newItem = cartDto.Adapt<ShoppingCartItem>();
                newItem.UserId = userId.Value;
                
                await cartRepo.AddAsync(newItem);
            }

            await cartRepo.SaveChangesAsync();
            return ApiResponseStatus.Ok<string>("Item added to cart");
        }

        [HttpGet(Name = "GetMyCart")]
        public async Task<ActionResult<ApplicationResult<List<ResponseCartItemDto>>>> GetMyCart()
        {
            var userId = currentUser.UserId;
            if (userId == null || userId == Guid.Empty)
                return ApiResponseStatus.BadRequest<List<ResponseCartItemDto>>(Errors.ValidationError("Invalid User"));

            var items = await cartRepo.FindAllAsync(c => c.UserId == userId.Value);
            return ApiResponseStatus.Ok<List<ResponseCartItemDto>>(items.Adapt<List<ResponseCartItemDto>>());
        }
    }
}
