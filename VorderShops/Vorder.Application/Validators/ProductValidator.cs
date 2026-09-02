using FluentValidation;
using Vorder.Domain.Entities;

namespace Vorder.Application.Validators
{
    public class ProductValidator : AbstractValidator<Product>
    {
        public ProductValidator()
        {

            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(100).WithMessage("Product name cannot exceed 100 characters.");
            RuleFor(p => p.Description)
                .MaximumLength(1000).WithMessage("Product description cannot exceed 1000 characters.");
            RuleFor(p => p.Price)
                .GreaterThan(0).WithMessage("Product price must be greater than zero.");
            RuleFor(p => p.StockQuantity)
                .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative.");
            RuleFor(p => p.SKU)
                .NotEmpty().WithMessage("SKU is required.")
                .MaximumLength(50).WithMessage("SKU cannot exceed 50 characters.");
           
            RuleFor(p => p.SubCategoryId)
                .NotEmpty().WithMessage("SubCategory ID is required.");
        }
    }
}
