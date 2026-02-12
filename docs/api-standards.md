# Core API Standards & Governance: Malik Shelter

## 1. Authentication & Authorization

*   **Mechanism**: **JWT (JSON Web Token)**
*   **Transport**: `Authorization: Bearer <token>` header.
*   **Token Strategy**:
    *   **Access Token**: Short-lived (e.g., 15-60 mins).
    *   **Refresh Token**: Long-lived (e.g., 7 days), securely stored (HttpOnly cookie recommended if web-only, or secure storage on mobile).
*   **Public Endpoints**: No header required.

## 2. URL Structure & Versioning

*   **Versioning Strategy**: **URL Path Versioning**
*   **Format**: `/api/{version}/{resource}`
*   **Example**:
    *   `GET /api/v1/animals`
    *   `POST /api/v1/adoptions`

## 3. Response Format

All responses must be wrapped in a standard envelope to ensure consistency.

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Luna",
    "species": "Cat"
  },
  "meta": {
    "requestId": "req_abc123"
  }
}
```

### Collection Response (with Pagination)
```json
{
  "success": true,
  "data": [
    { "id": "123", "name": "Luna" },
    { "id": "124", "name": "Max" }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 5,
    "total_items": 98
  },
  "meta": {
    "requestId": "req_abc123"
  }
}
```

## 4. Pagination

*   **Strategy**: **Page-Based**
*   **Query Parameters**:
    *   `page`: Page number (default: 1).
    *   `limit`: Items per page (default: 20, max: 100).
*   **Response**: Must include the `pagination` object shown above.

## 5. Error Handling

*   **Format**: **RFC 7807 (Problem Details)** standard.
*   **Structure**:
```json
{
  "success": false,
  "error": {
    "type": "https://api.malik-shelter.com/errors/validation-error",
    "title": "Validation Error",
    "status": 400,
    "detail": "Email address is invalid.",
    "instance": "/api/v1/auth/register",
    "errors": [
      { "field": "email", "message": "Invalid format" }
    ]
  },
  "meta": {
      "requestId": "req_abc123"
  }
}
```

## 6. Standard HTTP Methods

| Method | Idempotent | Usage |
| :--- | :--- | :--- |
| `GET` | Yes | Retrieve resources. Never modify state. |
| `POST` | No | Create new resources. |
| `PUT` | Yes | Update a resource (full replacement). |
| `PATCH` | No | Update a resource (partial update). |
| `DELETE` | Yes | Remove a resource. |

## 7. Date & Time

*   **Format**: ISO 8601 UTC for transport (`YYYY-MM-DDThh:mm:ssZ`).
*   **Storage**: UTC in database.
*   **Display**: Converted to user's local time on the client-side.
