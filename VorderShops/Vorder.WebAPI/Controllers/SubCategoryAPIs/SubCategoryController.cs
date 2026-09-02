using FluentValidation;
using FluentValidation.Results;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vorder.Application.DTOs.CategoryDtos;
using Vorder.Application.DTOs.SubCategoryDtos;
using Vorder.Application.Interfaces;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Entities;
using Vorder.Infrastructure.Data.Repositories;
using Vorder.WebAPI.Helpers;

namespace Vorder.WebAPI.Controllers.SubCategoryAPIs
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class SubCategoryController(ICurrentUserService currentUser, IValidator<CreateSubCategoryDto> validator, 
        IValidator<SubCategory> subCategoryValidator, 
        ISubCategoryRepository subCategoryRepo, 
        ICategoryRepository categoryRepository) : ControllerBase
    {

        [HttpGet(Name = "GetPaginatedSubCategories")]
        public async Task<ActionResult<ApplicationResult<List<ResponseSubCategoryDto>>>> GetPaginatedSubCategories(int PageNumber, int PageSize)
        {
            Guid ShopID;
            try
            {
                ShopID = currentUser.GetTenantId();
            }
            catch (UnauthorizedAccessException)
            {
                return ApiResponseStatus.BadRequest<List<ResponseSubCategoryDto>>(Errors.ValidationError("Invalid Shop ID"));
            }

            var SubCategories = await subCategoryRepo.GetPagedAsync(PageNumber, PageSize, ShopID);
            List<ResponseSubCategoryDto> SubCategoriesList = [];
            foreach (var subCategory in SubCategories)
            {
                SubCategoriesList.Add(subCategory.Adapt<ResponseSubCategoryDto>());
            }
            return ApiResponseStatus.Ok<List<ResponseSubCategoryDto>>(SubCategoriesList);
        }


        [HttpGet(Name = "GetSubCategories")]
        public async Task<ActionResult<ApplicationResult<List<ResponseSubCategoryDto>>>> GetSubCategories()
        {
            Guid ShopID;
            try
            {
                ShopID = currentUser.GetTenantId();
            }
            catch (UnauthorizedAccessException)
            {
                return ApiResponseStatus.BadRequest<List<ResponseSubCategoryDto>>(Errors.ValidationError("Invalid Shop ID"));
            }
            var SubCategories = await subCategoryRepo.GetAllAsync(ShopID);
            List<ResponseSubCategoryDto> SubCategoriesList = [];
            foreach (var SubCategory in SubCategories)
            {
                SubCategoriesList.Add(SubCategory.Adapt<ResponseSubCategoryDto>());
            }
            return ApiResponseStatus.Ok<List<ResponseSubCategoryDto>>(SubCategoriesList);
        }


        [HttpGet(Name = "GetSubCategoryByID")]
        public async Task<ActionResult<ApplicationResult<ResponseSubCategoryDto>>> GetSubCategoryByID(Guid SubCategoryID)
        {
            var SubCategory = await subCategoryRepo.GetByIdAsync(SubCategoryID);
            
            if (SubCategory is null)
            {
                return ApiResponseStatus.NotFound<ResponseSubCategoryDto>(Errors.NotFound(ErrorConstants.SUBCATEGORYNOTFOUND, ErrorConstants.SUBCATEGORYNOTFOUNDCODE));
            }

            return ApiResponseStatus.Ok<ResponseSubCategoryDto>(SubCategory.Adapt<ResponseSubCategoryDto>());
        }


        [HttpGet(Name = "GetSubCategoryByCategoryID")]
        public async Task<ActionResult<ApplicationResult<List<ResponseSubCategoryDto>>>> GetSubCategoryByCategoryID(Guid CategoryID)
        {
            List<SubCategory> SubCategory = await subCategoryRepo.GetByCategoryID(CategoryID);

            if (SubCategory is null)
            {
                return ApiResponseStatus.NotFound<List<ResponseSubCategoryDto>>(Errors.NotFound(ErrorConstants.SUBCATEGORYNOTFOUND, ErrorConstants.SUBCATEGORYNOTFOUNDCODE));
            }

            return ApiResponseStatus.Ok<List<ResponseSubCategoryDto>>(SubCategory.Adapt<List<ResponseSubCategoryDto>>());
        }


        [HttpPost(Name = "CreateSubCategory")]
        public async Task<ActionResult<ApplicationResult<ResponseSubCategoryDto>>> CreateSubCategory([FromBody] CreateSubCategoryDto createSubCategoryDto)
        {
            Guid ShopID;
            try
            {
                ShopID = currentUser.GetTenantId();
            }
            catch (UnauthorizedAccessException)
            {
                return ApiResponseStatus.BadRequest<ResponseSubCategoryDto>(Errors.ValidationError("Invalid Shop ID"));
            }
            ValidationResult validationResult = validator.Validate(createSubCategoryDto);

            if (!validationResult.IsValid)
            {
                string ErrorMsg = string.Join("; ",
                                    validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}"));

                return ApiResponseStatus.BadRequest<ResponseSubCategoryDto>(Errors.ValidationError(errorMsg: ErrorMsg));
            }

            Category? parentCategory = await categoryRepository.GetByIdAsync(createSubCategoryDto.CategoryId);

            if(parentCategory is null)
            {
                return ApiResponseStatus.NotFound<ResponseSubCategoryDto>(Errors.NotFound(ErrorConstants.CATEGORYNOTFOUND, ErrorConstants.CATEGORYNOTFOUNDCODE));
            }

            SubCategory SubCategory = createSubCategoryDto.Adapt<SubCategory>();
            // Note: SubCategory belongs to a shop via its parent Category's ShopID
            await subCategoryRepo.AddAsync(SubCategory);
            await subCategoryRepo.SaveChangesAsync();

            return ApiResponseStatus.Created<ResponseSubCategoryDto>(SubCategory.Adapt<ResponseSubCategoryDto>());
        }


        [HttpPatch("{id:guid}", Name = "UpdateSubCategory")]
        public async Task<ActionResult<ApplicationResult<ResponseSubCategoryDto>>> UpdateSubCategory(Guid id, UpdateSubCategoryDto SubCategoryDto)
        {
            SubCategory? existingSubCategory = await subCategoryRepo.GetByIdAsync(id);
            if (existingSubCategory is null)
                return ApiResponseStatus.NotFound<ResponseSubCategoryDto>(Errors.NotFound(ErrorConstants.SUBCATEGORYNOTFOUND, ErrorConstants.SUBCATEGORYNOTFOUNDCODE));

            SubCategoryDto.Adapt(existingSubCategory);

            ValidationResult validationResult = subCategoryValidator.Validate(existingSubCategory);
            if (!validationResult.IsValid)
            {
                string ErrorMsg = string.Join("; ",
                                    validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}"));

                return ApiResponseStatus.BadRequest<ResponseSubCategoryDto>(Errors.ValidationError(errorMsg: ErrorMsg));
            }

            Category? parentCategory = await categoryRepository.GetByIdAsync(existingSubCategory.CategoryId);
            if (parentCategory is null)
            {
                return ApiResponseStatus.NotFound<ResponseSubCategoryDto>(Errors.NotFound(ErrorConstants.CATEGORYNOTFOUND, ErrorConstants.CATEGORYNOTFOUNDCODE));
            }

            subCategoryRepo.Update(existingSubCategory);
            await subCategoryRepo.SaveChangesAsync();

            return ApiResponseStatus.Ok<ResponseSubCategoryDto>(existingSubCategory.Adapt<ResponseSubCategoryDto>());
        }


        [HttpDelete("{id:guid}", Name = "DeleteSubCategory")]
        public async Task<ActionResult<ApplicationResult<string>>> DeleteSubCategory(Guid id)
        {
            SubCategory? existingSubCategory = await subCategoryRepo.GetByIdAsync(id);
            if (existingSubCategory is null)
                return ApiResponseStatus.NotFound<string>(Errors.NotFound(ErrorConstants.SUBCATEGORYNOTFOUND, ErrorConstants.SUBCATEGORYNOTFOUNDCODE));

            subCategoryRepo.Delete(existingSubCategory);
            await subCategoryRepo.SaveChangesAsync();

            return ApiResponseStatus.Ok<string>("SubCategory Deleted Successfully");
        }


    }
}

