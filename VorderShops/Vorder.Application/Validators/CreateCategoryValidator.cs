using FluentValidation;
using Vorder.Domain.Entities;

namespace Vorder.Application.Validators
{
    public class CreateCategoryValidator : AbstractValidator<Category>
    {
        public CreateCategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(100).WithMessage("Category name must not exceed 100 characters.");

            RuleFor(x => x.Description)
                .Length(0, 500).WithMessage("Description must not exceed 500 characters.");
        }
    }
}
