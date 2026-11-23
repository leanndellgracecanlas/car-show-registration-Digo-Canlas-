namespace Infrastructure.Persistence;

using Application.Abstractions.Data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Registration> Registrations => Set<Registration>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Registration>(entity =>
        {
            entity.ToTable("Registrations");
            entity.HasKey(r => r.Id);

            entity.Property(r => r.RegistrationNumber).IsRequired().HasMaxLength(20);

            // SQLite returns DateTime with Kind=Unspecified; mark it UTC so JSON ends with "Z".
            entity.Property(r => r.RegistrationDate)
                .IsRequired()
                .HasConversion(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            entity.Property(r => r.ParticipantName).IsRequired().HasMaxLength(150);
            entity.Property(r => r.ContactNumber).IsRequired().HasMaxLength(11);
            entity.Property(r => r.Email).IsRequired().HasMaxLength(200);
            entity.Property(r => r.Address).IsRequired().HasMaxLength(300);
            entity.Property(r => r.CarMakeModel).IsRequired().HasMaxLength(100);
            entity.Property(r => r.PlateNumber).IsRequired().HasMaxLength(15);

            // Enums are stored as readable text.
            entity.Property(r => r.RegistrationType).HasConversion<string>().HasMaxLength(20).IsRequired();
            entity.Property(r => r.Status).HasConversion<string>().HasMaxLength(20).IsRequired();

            entity.Property(r => r.RegistrationFee).HasPrecision(18, 2);
            entity.Property(r => r.AmountPaid).HasPrecision(18, 2);

            // PaymentStatus is computed, never stored.
            entity.Ignore(r => r.PaymentStatus);

            // One car = one registration, and numbers never repeat.
            entity.HasIndex(r => r.PlateNumber).IsUnique();
            entity.HasIndex(r => r.RegistrationNumber).IsUnique();
        });
    }
}
