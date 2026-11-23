namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Messaging;
using Application.Common;
using Domain.Common;

/// <summary>
/// Query string of GET /api/registrations. All filters are optional and work alone or combined.
/// Type and Status are strings so that a bad value becomes a clean 400 from the validator.
/// </summary>
public sealed record GetRegistrationsQuery(
    string? ParticipantName = null,
    string? Type = null,
    string? Status = null,
    int Page = 1,
    int PageSize = 10) : IQuery<Result<PagedResponse<RegistrationResponse>>>;
