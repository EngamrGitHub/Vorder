using FluentValidation;
using Vorder.Domain.Entities;

namespace Vorder.Application.Validators
{
    public class CreateSubCategoryValidator : AbstractValidator<SubCategory>
    {
        public CreateSubCategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("SubCategory name is required.")
                .MaximumLength(100).WithMessage("SubCategory name must not exceed 100 characters.");
            RuleFor(x => x.Description)
                .Length(0, 500).WithMessage("Description must not exceed 500 characters.");
            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("CategoryId is required.");
        }
    }
}
