# SB Consultants Admin API

## Setup

1. Install dependencies:
   `npm install`

2. Import the MySQL schema:
   `npm run db:schema`

3. Copy environment defaults if needed:
   `copy backend\.env.example backend\.env`

4. Start the API:
   `npm run admin:api`

The API runs at `http://localhost:5000/api/admin`.

Default admin login after importing `backend/schema.sql`:

- Email: `admin@sbconsultants.in`
- Password: `admin123`

Change `JWT_SECRET` and the default admin password before production deployment.
