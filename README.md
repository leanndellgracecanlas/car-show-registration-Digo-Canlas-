# Car Show Registration System

Registration system for **Car Show 2027** (AutoVista Events, Sorsogon City Coliseum).
Participants register as **Exhibitors**, **Competitors** or **VIPs**. The API is the single source of truth:
it stores registrations in SQLite, applies the business rules (fees, numbers, statuses, validation)
and serves the data to the React dashboard.

Course: Integrative Programming 2 (CCDI Sorsogon) | Deadline: November 25, 2026

## Team

| MEMBER   | ROLE               |
| -------- | ------------------ |
| `<Name>` | Backend Developer  |
| `<Name>` | Frontend Developer |

## Project layout

```
car-show-registration/
├── backend/      C# .NET 10 Vertical Slice API (Domain, Application, Infrastructure, Api)
├── frontend/     React (Vite) app
├── docs/
│   └── screenshots/
└── README.md
```

## Run the backend

Requires the .NET 10 SDK and the EF Core tool (`dotnet tool install --global dotnet-ef`).

```bash
cd backend

# 1. Create the InitialCreate migration (only once, then commit the Migrations folder)
dotnet ef migrations add InitialCreate --project Infrastructure --startup-project Api --output-dir Persistence/Migrations

# 2. Run the API (applies migrations, creates carshow.db and seeds 25 registrations on first run)
dotnet run --project Api --launch-profile http
```

- API: http://localhost:5205
- Scalar UI: http://localhost:5205/scalar/v1
- Test requests: `backend/Api/Api.http`
- The database file `carshow.db` is created next to where the API runs and is ignored by Git.
  Delete it to reset the data.

## Run the frontend

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173 (allowed by the API's CORS policy)
```

## API endpoints

| Method | Endpoint                                                              | Success | Errors   |
| ------ | --------------------------------------------------------------------- | ------- | -------- |
| POST   | `/api/registrations`                                                  | 201     | 400, 409 |
| GET    | `/api/registrations?participantName=&type=&status=&page=1&pageSize=10` | 200     | 400      |
| GET    | `/api/registrations/{id}`                                             | 200     | 404      |
| GET    | `/api/registrations/summary`                                          | 200     | —        |

Business rules: fee is set by the server (Exhibitor ₱1,500, Competitor ₱2,500, VIP ₱5,000); registration
numbers are `CS27-0001`, `CS27-0002`, ...; one plate number = one registration; `amountPaid` must be between 0
and the fee; payment status (Unpaid / Partial / Paid) is computed, not stored.
