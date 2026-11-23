namespace Api.Features.Registrations;

using Api.Common.Extensions;
using Api.Common.Filters;
using Application.Abstractions.Messaging;
using Application.Common;
using Application.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationSummary;
using Domain.Common;

public static class RegistrationEndpoints
{
    public static IEndpointRouteBuilder MapRegistrationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/registrations").WithTags("Registrations");

        // 1. POST /api/registrations  -> 201 | 400 | 409
        group.MapPost("/", async (
                CreateRegistrationCommand command,
                ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.HandleAsync(command, ct);

                return result.IsSuccess
                    ? Results.Created($"/api/registrations/{result.Value!.Id}", result.Value)
                    : result.ToProblemDetails();
            })
            .AddEndpointFilter<ValidationFilter<CreateRegistrationCommand>>()
            .WithName("CreateRegistration")
            .WithSummary("Make a new registration")
            .Produces<RegistrationResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status409Conflict);

        // 2, 4, 5, 6. GET /api/registrations?participantName=&type=&status=&page=&pageSize=  -> 200 | 400
        group.MapGet("/", async (
                [AsParameters] GetRegistrationsQuery query,
                IQueryHandler<GetRegistrationsQuery, Result<PagedResponse<RegistrationResponse>>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.HandleAsync(query, ct);

                return result.IsSuccess
                    ? Results.Ok(result.Value)
                    : result.ToProblemDetails();
            })
            .AddEndpointFilter<ValidationFilter<GetRegistrationsQuery>>()
            .WithName("GetRegistrations")
            .WithSummary("Show all registrations (paged, with optional filters)")
            .Produces<PagedResponse<RegistrationResponse>>()
            .ProducesValidationProblem();

        // 7. GET /api/registrations/summary  -> 200   (declared before {id} on purpose)
        group.MapGet("/summary", async (
                IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.HandleAsync(new GetRegistrationSummaryQuery(), ct);

                return result.IsSuccess
                    ? Results.Ok(result.Value)
                    : result.ToProblemDetails();
            })
            .WithName("GetRegistrationSummary")
            .WithSummary("KPI totals for the dashboard")
            .Produces<RegistrationSummaryResponse>();

        // 3. GET /api/registrations/{id}  -> 200 | 404
        //    {id:guid} means "/abc" matches no route (404, no crash) and "/summary" is never read as an id.
        group.MapGet("/{id:guid}", async (
                Guid id,
                IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationResponse>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.HandleAsync(new GetRegistrationByIdQuery(id), ct);

                return result.IsSuccess
                    ? Results.Ok(result.Value)
                    : result.ToProblemDetails();
            })
            .WithName("GetRegistrationById")
            .WithSummary("Find registration by ID")
            .Produces<RegistrationResponse>()
            .ProducesProblem(StatusCodes.Status404NotFound);

        return app;
    }
}
