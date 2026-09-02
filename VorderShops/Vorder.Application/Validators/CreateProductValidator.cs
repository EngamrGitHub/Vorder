using FluentValidation;
using Vorder.Application.DTOs.ProductDtos;

namespace Vorder.Application.Validators
{
    public class CreateProductValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(100).WithMessage("Product name must not exceed 100 characters.");
            RuleFor(p => p.Description)
                .MaximumLength(1000).WithMessage("Product description must not exceed 1000 characters.");
            RuleFor(p => p.Price)
                .NotNull().WithMessage("Product price is required.")
                .GreaterThan(0).WithMessage("Product price must be greater than zero.");
            RuleFor(p => p.StockQuantity)
                .NotNull().WithMessage("Stock quantity is required.")
                .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative.");
            RuleFor(p => p.SKU)
                .NotEmpty().WithMessage("SKU is required.")
                .MaximumLength(50).WithMessage("SKU must not exceed 50 characters.");
            RuleFor(p => p.DiscountPercent)
                .InclusiveBetween(0, 100).WithMessage("Discount percent must be between 0 and 100.");

        }
    }
}
