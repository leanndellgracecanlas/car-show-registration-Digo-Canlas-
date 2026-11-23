# Car Show Registration — Backend (C# Vertical Slice API)

Built from the Vertical Slice template. See the root `README.md` for how to run it.

```
backend/
├── Domain/           Registration entity, enums, Result<T>, fee rules
├── Application/      Features/Registrations/<slice>/ (request, response, handler, validator)
├── Infrastructure/   AppDbContext (SQLite), mapping, migrations, seed data
└── Api/              Minimal API endpoints, ValidationFilter<T>, ResultExtensions, Program.cs
```

Slices: `CreateRegistration`, `GetRegistrations`, `GetRegistrationById`, `GetRegistrationSummary`.
