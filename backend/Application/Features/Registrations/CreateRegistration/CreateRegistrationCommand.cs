namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Enums;

/// <summary>
/// Request body for POST /api/registrations.
/// The number, date, fee and status are NOT here: the server sets them.
/// Extra JSON fields sent by a client (registrationFee, status, ...) are ignored.
/// </summary>
public sealed record CreateRegistrationCommand(
    string ParticipantName,
    string ContactNumber,
    string Email,
    string Address,
    string CarMakeModel,
    string PlateNumber,
    RegistrationType RegistrationType,
    decimal AmountPaid) : ICommand<Result<RegistrationResponse>>;
