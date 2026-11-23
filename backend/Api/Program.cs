using Api.Features.Registrations;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Common;
using Application.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationSummary;
using Domain.Common;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Database (SQLite file: data is saved between runs)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Data Source=carshow.db";

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
builder.Services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());

// Validators
builder.Services.AddValidatorsFromAssembly(typeof(IAppDbContext).Assembly);

// Handlers
builder.Services.AddScoped<ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>>, CreateRegistrationHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationsQuery, Result<PagedResponse<RegistrationResponse>>>, GetRegistrationsHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationResponse>>, GetRegistrationByIdHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>>, GetRegistrationSummaryHandler>();

// JSON: enums are written and read as strings ("Competitor", "Pending", "Partial")
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// CORS: allow the React dev server (Vite)
const string ReactCorsPolicy = "ReactDevServer";
builder.Services.AddCors(options =>
{
    options.AddPolicy(ReactCorsPolicy, policy => policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

// API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Car Show Registration API";
        document.Info.Description = "Car Show 2027 registrations (Vertical Slice Architecture, SQLite)";
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// Apply migrations, then seed the 25 sample registrations (only when the table is empty)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (dbContext.Database.GetMigrations().Any())
    {
        dbContext.Database.Migrate();
        DbSeeder.Seed(dbContext);
    }
    else
    {
        app.Logger.LogWarning(
            "No EF Core migrations found, so the database was not created. From the backend folder run: " +
            "dotnet ef migrations add InitialCreate --project Infrastructure --startup-project Api --output-dir Persistence/Migrations");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(ReactCorsPolicy);

// Root endpoint
app.MapGet("/", () => "Car Show Registration API is running. Go to /scalar/v1 for API documentation.")
    .ExcludeFromDescription();

// Map endpoints
app.MapRegistrationEndpoints();

app.Run();
