# AtlasCleanAI Enterprise API Guide

## API Style

The reference backend uses a JSON-based REST API over HTTPS. Clients authenticate with bearer tokens and interact with versioned resources under `/api/v1`.

Example base URLs:

- Local: `http://localhost:3000/api/v1`
- Staging: `https://staging.atlasclean.example.com/api/v1`
- Production: `https://api.atlasclean.example.com/api/v1`

## Authentication

### Login flow

Clients submit credentials to obtain short-lived access tokens and longer-lived refresh tokens.

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "ops.manager@atlasclean.ai",
  "password": "strong-password"
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<refresh-token>",
    "expiresIn": 900,
    "user": {
      "id": "usr_123",
      "role": "manager",
      "email": "ops.manager@atlasclean.ai"
    }
  }
}
```

### Authenticated requests

```http
Authorization: ******
```

### Refresh flow

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh-token>"
}
```

## Response Envelope

The shared Dart client expects a common response envelope.

```json
{
  "success": true,
  "data": {},
  "message": "optional human-readable message",
  "errors": {},
  "statusCode": 200
}
```

### Error response example

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "address": ["Address is required"],
    "scheduledAt": ["Scheduled time must be in the future"]
  },
  "statusCode": 422
}
```

## Core Resources

### Customers

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/customers` | Register a new customer account |
| `GET` | `/customers/me` | Retrieve the authenticated customer profile |
| `PATCH` | `/customers/me` | Update customer profile fields |

### Cleaners

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/cleaners/me` | Retrieve the authenticated cleaner profile |
| `PATCH` | `/cleaners/me/status` | Update availability or working status |
| `GET` | `/cleaners/me/jobs` | List assigned cleaning jobs |

### Bookings

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/bookings` | Create a booking request |
| `GET` | `/bookings` | List bookings for the authenticated principal |
| `GET` | `/bookings/{bookingId}` | Retrieve booking details |
| `PATCH` | `/bookings/{bookingId}` | Update a booking before lock-in |
| `POST` | `/bookings/{bookingId}/cancel` | Cancel a booking |

Booking request example:

```json
{
  "serviceType": "deep_clean",
  "scheduledAt": "2026-08-01T10:00:00Z",
  "durationHours": 3,
  "address": {
    "line1": "100 Market Street",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105"
  },
  "specialInstructions": "Please focus on kitchen appliances and bathrooms."
}
```

### Dispatch and scheduling

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/dispatch/recommendations` | Generate cleaner assignment recommendations |
| `POST` | `/dispatch/assignments/{bookingId}` | Confirm cleaner assignment |
| `GET` | `/dispatch/routes/{cleanerId}` | Fetch current route plan |

### Payments

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/payments/intents` | Create a payment intent |
| `POST` | `/payments/webhooks` | Receive PSP webhook notifications |
| `GET` | `/payments/{paymentId}` | Retrieve payment status |

## Health and readiness

### Liveness

```http
GET /health
```

Returns HTTP `200` when the service process is responsive.

### Readiness

```http
GET /ready
```

Recommended behavior:

- verify database connectivity
- verify Redis connectivity
- verify any critical dependent services required for request serving

## Rate limiting and proxy behavior

The local NGINX configuration applies request limiting to protect the API from bursts. In AWS, similar throttling can be enforced at the load balancer, WAF, or application layer.

Recommended headers returned by the API or proxy:

- `X-Request-Id`
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Versioning Strategy

- use `/api/v1` for the initial stable public contract
- add `/api/v2` only for breaking contract changes
- avoid silent field removals within a version
- prefer additive evolution for mobile client compatibility

## Mobile Client Integration Notes

The `atlas_api_client` package is designed to:

- build authenticated requests
- decode the shared response envelope
- surface status codes and error details consistently
- reduce duplication across customer and cleaner applications
