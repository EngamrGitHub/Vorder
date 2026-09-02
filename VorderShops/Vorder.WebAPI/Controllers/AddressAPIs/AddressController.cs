using Mapster;
using Microsoft.AspNetCore.Mvc;
using Vorder.Application.DTOs.AddressDtos;
using Vorder.Application.Interfaces;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Entities;
using Vorder.WebAPI.Helpers;

namespace Vorder.WebAPI.Controllers.AddressAPIs
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class AddressController(
        ICurrentUserService currentUser, 
        IAddressRepository addressRepo) : ControllerBase
    {
        [HttpPost(Name = "AddAddress")]
        public async Task<ActionResult<ApplicationResult<ResponseAddressDto>>> AddAddress(CreateAddressDto addressDto)
        {
            var userId = currentUser.UserId;
            if (userId == null || userId == Guid.Empty)
                return ApiResponseStatus.BadRequest<ResponseAddressDto>(Errors.ValidationError("Invalid User"));

            var address = addressDto.Adapt<Address>();
            address.UserId = userId.Value;

            await addressRepo.AddAsync(address);
            await addressRepo.SaveChangesAsync();

            return ApiResponseStatus.Created<ResponseAddressDto>(address.Adapt<ResponseAddressDto>());
        }

        [HttpGet(Name = "GetUserAddresses")]
        public async Task<ActionResult<ApplicationResult<List<ResponseAddressDto>>>> GetUserAddresses()
        {
            var userId = currentUser.UserId;
            if (userId == null || userId == Guid.Empty)
                return ApiResponseStatus.BadRequest<List<ResponseAddressDto>>(Errors.ValidationError("Invalid User"));

            var addresses = await addressRepo.FindAllAsync(a => a.UserId == userId.Value);
            return ApiResponseStatus.Ok<List<ResponseAddressDto>>(addresses.Adapt<List<ResponseAddressDto>>());
        }
    }
}
