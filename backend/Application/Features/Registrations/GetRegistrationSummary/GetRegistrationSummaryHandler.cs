namespace Application.Features.Registrations.GetRegistrationSummary;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationSummaryHandler(IAppDbContext db)
    : IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>>
{
    public async Task<Result<RegistrationSummaryResponse>> HandleAsync(
        GetRegistrationSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        // SQLite cannot SUM decimal columns in SQL, so load the small columns and add them up here.
        var rows = await db.Registrations
            .AsNoTracking()
            .Select(r => new { r.Status, r.RegistrationFee, r.AmountPaid })
            .ToListAsync(cancellationToken);

        var active = rows.Where(r => r.Status != RegistrationStatus.Cancelled).ToList();

        var totalFees = active.Sum(r => r.RegistrationFee);
        var totalPayments = active.Sum(r => r.AmountPaid);

        var summary = new RegistrationSummaryResponse(
            TotalRegistrations: rows.Count,
            Confirmed: rows.Count(r => r.Status == RegistrationStatus.Confirmed),
            CheckedIn: rows.Count(r => r.Status == RegistrationStatus.CheckedIn),
            Pending: rows.Count(r => r.Status == RegistrationStatus.Pending),
            Cancelled: rows.Count(r => r.Status == RegistrationStatus.Cancelled),
            TotalFees: totalFees,
            TotalPayments: totalPayments,
            UncollectedPayments: totalFees - totalPayments);

        return Result<RegistrationSummaryResponse>.Success(summary);
    }
}
