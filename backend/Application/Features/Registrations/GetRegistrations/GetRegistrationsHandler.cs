namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Common;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationsHandler(IAppDbContext db)
    : IQueryHandler<GetRegistrationsQuery, Result<PagedResponse<RegistrationResponse>>>
{
    public async Task<Result<PagedResponse<RegistrationResponse>>> HandleAsync(
        GetRegistrationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var registrations = db.Registrations.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            var name = query.ParticipantName.Trim().ToLower();
            registrations = registrations.Where(r => r.ParticipantName.ToLower().Contains(name));
        }

        if (!string.IsNullOrWhiteSpace(query.Type))
        {
            var type = Enum.Parse<RegistrationType>(query.Type.Trim(), ignoreCase: true);
            registrations = registrations.Where(r => r.RegistrationType == type);
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            var status = Enum.Parse<RegistrationStatus>(query.Status.Trim(), ignoreCase: true);
            registrations = registrations.Where(r => r.Status == status);
        }

        var totalCount = await registrations.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize);

        // long math so a huge page number cannot overflow
        var skip = (long)(query.Page - 1) * query.PageSize;

        List<RegistrationResponse> items = [];
        if (skip < totalCount)
        {
            var rows = await registrations
                .OrderByDescending(r => r.RegistrationDate)      // newest first
                .ThenByDescending(r => r.RegistrationNumber)
                .Skip((int)skip)
                .Take(query.PageSize)
                .ToListAsync(cancellationToken);

            items = rows.Select(r => r.ToResponse()).ToList();
        }

        return Result<PagedResponse<RegistrationResponse>>.Success(
            new PagedResponse<RegistrationResponse>(items, query.Page, query.PageSize, totalCount, totalPages));
    }
}
