using Mapster;
using Microsoft.AspNetCore.Mvc;
using Vorder.Application.DTOs.PaymentDtos;
using Vorder.Application.Interfaces;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Entities;
using Vorder.WebAPI.Helpers;

namespace Vorder.WebAPI.Controllers.PaymentAPIs
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class PaymentController(
        IPaymentRepository paymentRepo,
        IOrderRepository orderRepo,
        ICurrentUserService currentUser) : ControllerBase
    {
        [HttpPost(Name = "ProcessPayment")]
        public async Task<ActionResult<ApplicationResult<ResponsePaymentDto>>> ProcessPayment(CreatePaymentDto paymentDto)
        {
            var userId = currentUser.UserId;
            if (userId == null || userId == Guid.Empty)
                return ApiResponseStatus.BadRequest<ResponsePaymentDto>(Errors.ValidationError("Invalid User"));

            var order = await orderRepo.GetByIdAsync(paymentDto.OrderId);
            if (order == null)
                return ApiResponseStatus.NotFound<ResponsePaymentDto>(Errors.NotFound("Order not found", "404"));

            // Only the order owner may pay for it
            if (order.UserId != userId.Value)
                return ApiResponseStatus.Forbidden<ResponsePaymentDto>(Errors.Forbidden(ErrorConstants.FORBIDDEN, ErrorConstants.FORBIDDENCODE));

            // Prevent duplicate payments for the same order
            var existingPayments = await paymentRepo.FindAllAsync(p => p.OrderId == paymentDto.OrderId);
            if (existingPayments.Any())
                return ApiResponseStatus.BadRequest<ResponsePaymentDto>(Errors.Exists("Order already paid", "PAYMENT409"));

            var payment = paymentDto.Adapt<Payment>();
            payment.Status = "Completed"; // Simulate successful payment

            await paymentRepo.AddAsync(payment);
            await paymentRepo.SaveChangesAsync();

            return ApiResponseStatus.Created<ResponsePaymentDto>(payment.Adapt<ResponsePaymentDto>());
        }

        [HttpGet("{orderId:guid}", Name = "GetOrderPayments")]
        public async Task<ActionResult<ApplicationResult<List<ResponsePaymentDto>>>> GetOrderPayments(Guid orderId)
        {
            var userId = currentUser.UserId;
            if (userId == null || userId == Guid.Empty)
                return ApiResponseStatus.BadRequest<List<ResponsePaymentDto>>(Errors.ValidationError("Invalid User"));

            var order = await orderRepo.GetByIdAsync(orderId);
            if (order == null)
                return ApiResponseStatus.NotFound<List<ResponsePaymentDto>>(Errors.NotFound("Order not found", "404"));

            // Only the order owner may view its payments
            if (order.UserId != userId.Value)
                return ApiResponseStatus.Forbidden<List<ResponsePaymentDto>>(Errors.Forbidden(ErrorConstants.FORBIDDEN, ErrorConstants.FORBIDDENCODE));

            var payments = await paymentRepo.FindAllAsync(p => p.OrderId == orderId);
            return ApiResponseStatus.Ok<List<ResponsePaymentDto>>(payments.Adapt<List<ResponsePaymentDto>>());
        }
    }
}
