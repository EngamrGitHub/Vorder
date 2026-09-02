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
        IPaymentRepository paymentRepo) : ControllerBase
    {
        [HttpPost(Name = "ProcessPayment")]
        public async Task<ActionResult<ApplicationResult<ResponsePaymentDto>>> ProcessPayment(CreatePaymentDto paymentDto)
        {
            var payment = paymentDto.Adapt<Payment>();
            payment.Status = "Completed"; // Simulate successful payment

            await paymentRepo.AddAsync(payment);
            await paymentRepo.SaveChangesAsync();

            return ApiResponseStatus.Created<ResponsePaymentDto>(payment.Adapt<ResponsePaymentDto>());
        }

        [HttpGet("{orderId:guid}", Name = "GetOrderPayments")]
        public async Task<ActionResult<ApplicationResult<List<ResponsePaymentDto>>>> GetOrderPayments(Guid orderId)
        {
            var payments = await paymentRepo.FindAllAsync(p => p.OrderId == orderId);
            return ApiResponseStatus.Ok<List<ResponsePaymentDto>>(payments.Adapt<List<ResponsePaymentDto>>());
        }
    }
}
