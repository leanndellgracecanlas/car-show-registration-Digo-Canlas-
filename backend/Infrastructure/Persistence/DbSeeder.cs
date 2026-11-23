namespace Infrastructure.Persistence;

using Domain.Entities;
using Domain.Enums;

/// <summary>
/// Seeds 25 sample registrations (only when the table is empty) covering
/// every type, every status and every payment status, so the frontend has data to filter and page.
/// </summary>
public static class DbSeeder
{
    private static readonly string[] Addresses =
    [
        "Rizal St., Sorsogon City",
        "Magsaysay Ave., Bulan, Sorsogon",
        "Quezon St., Gubat, Sorsogon",
        "Osmena St., Barcelona, Sorsogon",
        "Rosal St., Irosin, Sorsogon"
    ];

    // name, car, type, status, amount paid
    private static readonly (string Name, string Car, RegistrationType Type, RegistrationStatus Status, decimal Paid)[] Samples =
    [
        ("Mario Santos",          "Honda Civic Type R",       RegistrationType.Exhibitor,  RegistrationStatus.Confirmed, 1500m),
        ("Ana Reyes",             "Nissan GT-R R35",          RegistrationType.Competitor, RegistrationStatus.Confirmed, 2500m),
        ("Roberto Villanueva",    "Porsche 911 Carrera",      RegistrationType.VIP,        RegistrationStatus.Confirmed, 5000m),
        ("Juan Magtanggol",       "Mazda RX-7 FD",            RegistrationType.Competitor, RegistrationStatus.Pending,   1000m),
        ("Maria Clara Dela Rosa", "Toyota AE86 Trueno",       RegistrationType.Exhibitor,  RegistrationStatus.Pending,   0m),
        ("Carlo Mendoza",         "BMW M4 Competition",       RegistrationType.VIP,        RegistrationStatus.Pending,   2500m),
        ("Analyn Cruz",           "Subaru WRX STI",           RegistrationType.Competitor, RegistrationStatus.CheckedIn, 2500m),
        ("Paolo Garcia",          "Volkswagen Beetle 1968",   RegistrationType.Exhibitor,  RegistrationStatus.CheckedIn, 1500m),
        ("Liza Ramos",            "Mercedes-Benz AMG GT",     RegistrationType.VIP,        RegistrationStatus.CheckedIn, 5000m),
        ("Jericho Flores",        "Mitsubishi Lancer Evo IX", RegistrationType.Competitor, RegistrationStatus.Confirmed, 1500m),
        ("Diana Bautista",        "Ford Mustang GT",          RegistrationType.Exhibitor,  RegistrationStatus.Confirmed, 1000m),
        ("Kenneth Aquino",        "Lamborghini Huracan",      RegistrationType.VIP,        RegistrationStatus.Confirmed, 5000m),
        ("Jun Dela Torre",        "Toyota Supra MK4",         RegistrationType.Competitor, RegistrationStatus.CheckedIn, 2500m),
        ("Sofia Navarro",         "Mini Cooper S",            RegistrationType.Exhibitor,  RegistrationStatus.Pending,   0m),
        ("Miguel Fernandez",      "Honda S2000",              RegistrationType.Competitor, RegistrationStatus.Pending,   500m),
        ("Patricia Castillo",     "Audi R8 V10",              RegistrationType.VIP,        RegistrationStatus.Pending,   0m),
        ("Rey Gonzales",          "Datsun 240Z",              RegistrationType.Exhibitor,  RegistrationStatus.Cancelled, 1500m),
        ("Bianca Lopez",          "Nissan Silvia S15",        RegistrationType.Competitor, RegistrationStatus.Cancelled, 0m),
        ("Tomas Rivera",          "Ferrari 488 GTB",          RegistrationType.VIP,        RegistrationStatus.Cancelled, 2000m),
        ("Ana Marie Lim",         "Toyota GR86",              RegistrationType.Competitor, RegistrationStatus.Confirmed, 2500m),
        ("Eric Tan",              "Chevrolet Camaro 1969",    RegistrationType.Exhibitor,  RegistrationStatus.CheckedIn, 1500m),
        ("Joanna Pascual",        "McLaren 720S",             RegistrationType.VIP,        RegistrationStatus.CheckedIn, 5000m),
        ("Dennis Ocampo",         "Mazda MX-5 Miata",         RegistrationType.Competitor, RegistrationStatus.Confirmed, 0m),
        ("Grace Salazar",         "Suzuki Jimny",             RegistrationType.Exhibitor,  RegistrationStatus.Confirmed, 750m),
        ("Vincent Soriano",       "Aston Martin Vantage",     RegistrationType.VIP,        RegistrationStatus.CheckedIn, 4000m)
    ];

    public static void Seed(AppDbContext db)
    {
        if (db.Registrations.Any())
            return;

        var start = new DateTime(2026, 10, 1, 8, 0, 0, DateTimeKind.Utc);

        var registrations = Samples.Select((s, i) =>
        {
            var n = i + 1;
            return new Registration
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = $"{Registration.NumberPrefix}{n:D4}",
                RegistrationDate = start.AddDays(i).AddMinutes(i * 7),
                ParticipantName = s.Name,
                ContactNumber = $"0917123{n:D4}",
                Email = $"{s.Name.ToLowerInvariant().Replace(' ', '.')}@example.com",
                Address = Addresses[i % Addresses.Length],
                CarMakeModel = s.Car,
                PlateNumber = $"SEED {1000 + n}",
                RegistrationType = s.Type,
                Status = s.Status,
                RegistrationFee = RegistrationFees.For(s.Type),
                AmountPaid = s.Paid
            };
        }).ToList();

        db.Registrations.AddRange(registrations);
        db.SaveChanges();
    }
}
