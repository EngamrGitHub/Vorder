using FluentValidation;
using FluentValidation.Results;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Vorder.Application.DTOs.CategoryDtos;
using Vorder.Application.Interfaces;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Entities;
using Vorder.WebAPI.Helpers;

namespace Vorder.WebAPI.Controllers.CategoryAPIs
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class CategoryController(ICurrentUserService currentUser, IValidator<CreateCategoryDto> validator, IValidator<Category> categoryValidator, ICategoryRepository categoryRepo) : ControllerBase
    {

        [HttpGet(Name = "GetPaginatedCategories")]
        public async Task<ActionResult<ApplicationResult<List<ResponseCategoryDto>>>> GetPaginatedCategories(int PageNumber, int PageSize)
        {
            Guid ShopID;
            try
            {
                ShopID = currentUser.GetTenantId();
            }
            catch (UnauthorizedAccessException)
            {
                return ApiResponseStatus.BadRequest<List<ResponseCategoryDto>>(Errors.ValidationError("Invalid Shop ID"));
            }                

            var categories = await categoryRepo.GetPagedAsync(PageNumber, PageSize, ShopID);
            List<ResponseCategoryDto> categoriesList = [];
            foreach (var category in categories)
            {
                categoriesList.Add(category.Adapt<ResponseCategoryDto>());
            }
            return ApiResponseStatus.Ok<List<ResponseCategoryDto>>(categoriesList);
        }


        [HttpGet(Name = "GetCategories")]
        public async Task<ActionResult<ApplicationResult<List<ResponseCategoryDto>>>> GetCategories()
        {
            Guid ShopID;
            try
            {
                ShopID = currentUser.GetTenantId();
            }
            catch (UnauthorizedAccessException)
            {
                return ApiResponseStatus.BadRequest<List<ResponseCategoryDto>>(Errors.ValidationError("Invalid Shop ID"));
            }

            var Categories = await categoryRepo.GetAllAsync(ShopID);
            List<ResponseCategoryDto> CategoriesList = [];
            foreach (var category in Categories)
            {
                CategoriesList.Add(category.Adapt<ResponseCategoryDto>());
            }
            return ApiResponseStatus.Ok<List<ResponseCategoryDto>>(CategoriesList);
        }


        [HttpGet(Name = "GetCategoryByID")]
        public async Task<ActionResult<ApplicationResult<ResponseCategoryDto>>> GetCategoryByID(Guid CategoryID)
        {
            var Category = await categoryRepo.GetByIdAsync(CategoryID);
            if (Category is null)
            {
                return ApiResponseStatus.NotFound<ResponseCategoryDto>(Errors.NotFound(ErrorConstants.CATEGORYNOTFOUND, ErrorConstants.CATEGORYNOTFOUNDCODE));
            }

            return ApiResponseStatus.Ok<ResponseCategoryDto>(Category.Adapt<ResponseCategoryDto>());
        }


        [HttpPost(Name = "CreateCategory")]
        public async Task<ActionResult<ApplicationResult<ResponseCategoryDto>>> CreateCategory([FromForm] CreateCategoryDto createCategoryDto)
        {
            Guid ShopID;
            try
            {
                ShopID = currentUser.GetTenantId();
            }
            catch (UnauthorizedAccessException)
            {
                return ApiResponseStatus.BadRequest<ResponseCategoryDto>(Errors.ValidationError("Invalid Shop ID"));
            }
            ValidationResult validationResult = validator.Validate(createCategoryDto);

            if (!validationResult.IsValid)
            {
                string ErrorMsg = string.Join("; ",
                                    validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}"));

                return ApiResponseStatus.BadRequest<ResponseCategoryDto>(Errors.ValidationError(errorMsg: ErrorMsg));
            }

            Category category = createCategoryDto.Adapt<Category>();
            category.ShopID = ShopID;

            await categoryRepo.AddAsync(category);
            await categoryRepo.SaveChangesAsync();

            return ApiResponseStatus.Created<ResponseCategoryDto>(category.Adapt<ResponseCategoryDto>());
        }


        [HttpPatch("{id:guid}", Name = "UpdateCategory")]
        public async Task<ActionResult<ApplicationResult<ResponseCategoryDto>>> UpdateCategory(Guid id, UpdateCategoryDto categoryDto)
        {
            Category? existingCategory = await categoryRepo.GetByIdAsync(id);
            if (existingCategory is null)
                return ApiResponseStatus.NotFound<ResponseCategoryDto>(Errors.NotFound(ErrorConstants.CATEGORYNOTFOUND, ErrorConstants.CATEGORYNOTFOUNDCODE));

            categoryDto.Adapt(existingCategory);

            ValidationResult validationResult = categoryValidator.Validate(existingCategory);
            if (!validationResult.IsValid)
            {
                string ErrorMsg = string.Join("; ",
                                    validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}"));

                return ApiResponseStatus.BadRequest<ResponseCategoryDto>(Errors.ValidationError(errorMsg: ErrorMsg));
            }

            categoryRepo.Update(existingCategory);
            await categoryRepo.SaveChangesAsync();

            return ApiResponseStatus.Ok<ResponseCategoryDto>(existingCategory.Adapt<ResponseCategoryDto>());
        }


        [HttpDelete("{id:guid}", Name = "DeleteCategory")]
        public async Task<ActionResult<ApplicationResult<string>>> DeleteCategory(Guid id)
        {
            Category? existingCategory = await categoryRepo.GetByIdAsync(id);
            if (existingCategory is null)
                return ApiResponseStatus.NotFound<string>(Errors.NotFound(ErrorConstants.CATEGORYNOTFOUND, ErrorConstants.CATEGORYNOTFOUNDCODE));

            categoryRepo.Delete(existingCategory);
            await categoryRepo.SaveChangesAsync();

            return ApiResponseStatus.Ok<string>("Category Deleted Successfully");
        }


        // dev branch
    }
}
