using FluentValidation;
using FluentValidation.Results;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Vorder.Application.DTOs.OrderDtos;
using Vorder.Application.Interfaces;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Entities;
using Vorder.WebAPI.Helpers;

namespace Vorder.WebAPI.Controllers.OrderAPIs
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class OrderController(
        ICurrentUserService currentUser, 
        IOrderRepository orderRepo, 
        IProductRepository productRepo) : ControllerBase
    {

        [HttpPost(Name = "CreateOrder")]
        public async Task<ActionResult<ApplicationResult<ResponseOrderDto>>> CreateOrder(CreateOrderDto createOrderDto)
        {
            var userId = currentUser.UserId;
            if (userId == null || userId == Guid.Empty)
                return ApiResponseStatus.BadRequest<ResponseOrderDto>(Errors.ValidationError("Invalid User"));

            var order = createOrderDto.Adapt<Order>();
            order.UserId = userId.Value;
            order.OrderItems = new List<OrderItem>();

            decimal totalAmount = 0;

            foreach (var itemDto in createOrderDto.Items)
            {
                var product = await productRepo.GetByIdAsync(itemDto.ProductId);
                if (product == null)
                    continue;

                var orderItem = itemDto.Adapt<OrderItem>();
                orderItem.UnitPriceSnapshot = product.Price; // Snapshot current price

                order.OrderItems.Add(orderItem);
                totalAmount += orderItem.UnitPriceSnapshot * orderItem.Quantity;
            }

            order.TotalAmount = totalAmount;

            await orderRepo.AddAsync(order);
            await orderRepo.SaveChangesAsync();

            return ApiResponseStatus.Created<ResponseOrderDto>(order.Adapt<ResponseOrderDto>());
        }

        [HttpGet("{id:guid}", Name = "GetOrderById")]
        public async Task<ActionResult<ApplicationResult<ResponseOrderDto>>> GetOrderById(Guid id)
        {
            var order = await orderRepo.GetByIdAsync(id);
            if (order == null)
                return ApiResponseStatus.NotFound<ResponseOrderDto>(Errors.NotFound("Order not found", "404"));

            return ApiResponseStatus.Ok<ResponseOrderDto>(order.Adapt<ResponseOrderDto>());
        }
    }
}
