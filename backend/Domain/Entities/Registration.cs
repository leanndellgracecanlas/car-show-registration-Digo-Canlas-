namespace Domain.Entities;

using Domain.Common;
using Domain.Enums;

/// <summary>One participant entering one car in the Car Show 2027.</summary>
public class Registration : BaseEntity
{
    public const string NumberPrefix = "CS27-";

    public string RegistrationNumber { get; set; } = string.Empty;   // server generated: CS27-0001
    public DateTime RegistrationDate { get; set; }                   // server set (UTC)
    public string ParticipantName { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string CarMakeModel { get; set; } = string.Empty;
    public string PlateNumber { get; set; } = string.Empty;
    public RegistrationType RegistrationType { get; set; }
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;
    public decimal RegistrationFee { get; set; }                     // server set from the type
    public decimal AmountPaid { get; set; }

    /// <summary>Computed, not stored.</summary>
    public PaymentStatus PaymentStatus =>
        AmountPaid <= 0 ? PaymentStatus.Unpaid
        : AmountPaid < RegistrationFee ? PaymentStatus.Partial
        : PaymentStatus.Paid;
}
