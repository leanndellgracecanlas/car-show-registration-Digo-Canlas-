namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class CreateRegistrationHandler(IAppDbContext db)
    : ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>>
{
    public async Task<Result<RegistrationResponse>> HandleAsync(
        CreateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        var plate = command.PlateNumber.Trim().ToUpperInvariant();

        // Rule: one car = one registration.
        var plateTaken = await db.Registrations.AnyAsync(r => r.PlateNumber == plate, cancellationToken);
        if (plateTaken)
            return DuplicatePlate(plate);

        var registration = new Registration
        {
            Id = Guid.NewGuid(),
            RegistrationNumber = await NextRegistrationNumberAsync(cancellationToken),
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName.Trim(),
            ContactNumber = command.ContactNumber.Trim(),
            Email = command.Email.Trim(),
            Address = command.Address.Trim(),
            CarMakeModel = command.CarMakeModel.Trim(),
            PlateNumber = plate,
            RegistrationType = command.RegistrationType,
            Status = RegistrationStatus.Pending,                          // default, never from the client
            RegistrationFee = RegistrationFees.For(command.RegistrationType), // server decides the fee
            AmountPaid = command.AmountPaid
        };

        db.Registrations.Add(registration);

        try
        {
            await db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            // Two requests at the same time can still hit the unique indexes.
            return Result<RegistrationResponse>.Failure(Error.Conflict(
                "Registration.Conflict",
                $"The registration could not be saved because plate number '{plate}' or the next registration number was just taken. Please try again."));
        }

        return Result<RegistrationResponse>.Success(registration.ToResponse());
    }

    private async Task<string> NextRegistrationNumberAsync(CancellationToken cancellationToken)
    {
        var last = await db.Registrations
            .OrderByDescending(r => r.RegistrationNumber)
            .Select(r => r.RegistrationNumber)
            .FirstOrDefaultAsync(cancellationToken);

        var lastSequence = 0;
        if (last is not null && last.StartsWith(Registration.NumberPrefix))
            int.TryParse(last[Registration.NumberPrefix.Length..], out lastSequence);

        return $"{Registration.NumberPrefix}{lastSequence + 1:D4}";
    }

    private static Result<RegistrationResponse> DuplicatePlate(string plate) =>
        Result<RegistrationResponse>.Failure(Error.Conflict(
            "Registration.Conflict",
            $"A registration with plate number '{plate}' already exists."));
}
