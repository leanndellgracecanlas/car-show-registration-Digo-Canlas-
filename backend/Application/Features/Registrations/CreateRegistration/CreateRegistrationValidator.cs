namespace Application.Features.Registrations.CreateRegistration;

using Domain.Entities;
using FluentValidation;

public sealed class CreateRegistrationValidator : AbstractValidator<CreateRegistrationCommand>
{
    public CreateRegistrationValidator()
    {
        RuleFor(x => x.ParticipantName)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(x => x.ContactNumber)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .Matches(@"^09\d{9}$")
            .WithMessage("'Contact Number' must be a PH mobile number in the format 09XXXXXXXXX (11 digits).");

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .MaximumLength(200)
            .EmailAddress();

        RuleFor(x => x.Address)
            .NotEmpty()
            .MaximumLength(300);

        RuleFor(x => x.CarMakeModel)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.PlateNumber)
            .NotEmpty()
            .MaximumLength(15);

        RuleFor(x => x.RegistrationType)
            .IsInEnum()
            .WithMessage("'Registration Type' must be Exhibitor, Competitor or VIP.");

        RuleFor(x => x.AmountPaid)
            .GreaterThanOrEqualTo(0)
            .WithMessage("'Amount Paid' must be 0 or more.");

        // Amount paid can never be more than the fee of the chosen type.
        RuleFor(x => x.AmountPaid)
            .Must((command, paid) => paid <= RegistrationFees.For(command.RegistrationType))
            .When(x => Enum.IsDefined(x.RegistrationType))
            .WithMessage(x =>
                $"'Amount Paid' cannot be more than the registration fee ({RegistrationFees.For(x.RegistrationType):N0}).");
    }
}
