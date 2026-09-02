using Mapster;
using Microsoft.AspNetCore.Mvc;
using Vorder.Application.DTOs.ReviewDtos;
using Vorder.Application.Interfaces;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Entities;
using Vorder.WebAPI.Helpers;

namespace Vorder.WebAPI.Controllers.ReviewAPIs
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class ReviewController(
        ICurrentUserService currentUser, 
        IReviewRepository reviewRepo) : ControllerBase
    {
        [HttpPost(Name = "CreateReview")]
        public async Task<ActionResult<ApplicationResult<ResponseReviewDto>>> CreateReview(CreateReviewDto reviewDto)
        {
            var userId = currentUser.UserId;
            if (userId == null || userId == Guid.Empty)
                return ApiResponseStatus.BadRequest<ResponseReviewDto>(Errors.ValidationError("Invalid User"));

            var review = reviewDto.Adapt<Review>();
            review.UserId = userId.Value;

            await reviewRepo.AddAsync(review);
            await reviewRepo.SaveChangesAsync();

            return ApiResponseStatus.Created<ResponseReviewDto>(review.Adapt<ResponseReviewDto>());
        }

        [HttpGet("{productId:guid}", Name = "GetProductReviews")]
        public async Task<ActionResult<ApplicationResult<List<ResponseReviewDto>>>> GetProductReviews(Guid productId)
        {
            var reviews = await reviewRepo.FindAllAsync(r => r.ProductId == productId);
            return ApiResponseStatus.Ok<List<ResponseReviewDto>>(reviews.Adapt<List<ResponseReviewDto>>());
        }
    }
}
