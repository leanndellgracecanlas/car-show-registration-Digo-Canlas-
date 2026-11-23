namespace Application.Features.Registrations.GetRegistrations;

using Domain.Enums;
using FluentValidation;

public sealed class GetRegistrationsValidator : AbstractValidator<GetRegistrationsQuery>
{
    private static readonly string[] TypeNames = Enum.GetNames<RegistrationType>();
    private static readonly string[] StatusNames = Enum.GetNames<RegistrationStatus>();

    public GetRegistrationsValidator()
    {
        RuleFor(x => x.ParticipantName)
            .MaximumLength(150);

        RuleFor(x => x.Type)
            .Must(BeAType)
            .When(x => !string.IsNullOrWhiteSpace(x.Type))
            .WithMessage($"'Type' must be one of: {string.Join(", ", TypeNames)}.");

        RuleFor(x => x.Status)
            .Must(BeAStatus)
            .When(x => !string.IsNullOrWhiteSpace(x.Status))
            .WithMessage($"'Status' must be one of: {string.Join(", ", StatusNames)}.");

        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("'Page' must be 1 or more.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("'PageSize' must be between 1 and 50.");
    }

    // Compare names only, so "1" or "99" are not accepted as numbers.
    private static bool BeAType(string? value) =>
        TypeNames.Contains(value!.Trim(), StringComparer.OrdinalIgnoreCase);

    private static bool BeAStatus(string? value) =>
        StatusNames.Contains(value!.Trim(), StringComparer.OrdinalIgnoreCase);
}
