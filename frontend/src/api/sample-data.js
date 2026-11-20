export const SAMPLE_REGISTRATIONS = [
  {
    id: "3f2c9a1e-0001-4000-8000-000000000001",
    registrationNumber: "CS27-0001",
    registrationDate: "2027-02-10T08:30:00Z",
    participantName: "Juan Dela Cruz",
    contactNumber: "09171234567",
    email: "juan@example.com",
    address: "123 Rizal St., Naga City",
    carMakeModel: "Toyota Supra MK4",
    plateNumber: "ABC 1234",
    registrationType: "Competitor",
    status: "Confirmed",
    registrationFee: 2500.00,
    amountPaid: 1000.00,
    paymentStatus: "Partial"
  },
  {
    id: "3f2c9a1e-0002-4000-8000-000000000002",
    registrationNumber: "CS27-0002",
    registrationDate: "2027-02-10T09:15:00Z",
    participantName: "Maria Santos",
    contactNumber: "09189876543",
    email: "maria@example.com",
    address: "45 Magsaysay Ave., Sorsogon City",
    carMakeModel: "Nissan GT-R R35",
    plateNumber: "XYZ 9876",
    registrationType: "VIP",
    status: "CheckedIn",
    registrationFee: 5000.00,
    amountPaid: 5000.00,
    paymentStatus: "Paid"
  }
];

export async function getRegistrationsSample() {
  return { items: SAMPLE_REGISTRATIONS, totalCount: SAMPLE_REGISTRATIONS.length };
}
