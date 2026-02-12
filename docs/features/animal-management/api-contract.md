# API Contract: Animal Management

## Overview
This document specifies the API endpoints for managing animals in the Malik Shelter system. These endpoints are already implemented and support the detailed animal profile, medical, and personality fields.

## Base URL
`http://localhost:3000`

## Authentication
All endpoints require a Bearer Token in the `Authorization` header.
- Header: `Authorization: Bearer <JWT_TOKEN>`
- Role Required: `STAFF` or `ADMIN` (for management actions)

---

## 1. Create Animal
Creates a new animal profile with optional multi-photo upload.

- **Endpoint**: `POST /animals`
- **Content-Type**: `multipart/form-data`

### Request Body (Form-Data)
| Field | Type | Description |
|-------|------|-------------|
| name | String | (Required) Name of the pet |
| species | String | (Required) e.g., "Dog", "Cat" |
| breed | String | (Required) e.g., "Golden Retriever" |
| gender | String | (Required) "MALE" or "FEMALE" |
| age_months | Number | (Required) Age in months |
| weight_kg | Number | (Required) Weight in kilograms |
| bio | String | (Optional) Narrative description |
| origin | String | (Optional) Free-text source info |
| is_sterilized | Boolean | (Required) String "true" or "false" |
| medical_summary| String | (Optional) Known medical history |
| dietary_requirements | String | (Optional) Specific diet needs |
| energy_level | String | (Optional) "1" through "5" |
| social_compatibility | String | (Optional) Tags for humans/pets/kids |
| training_level | String | (Optional) Training status |
| status | String | (Required) Initial status (e.g., "AVAILABLE") |
| photos | Files | (Optional) Up to 5 image files (Max 5MB each) |

---

## 2. Update Animal
Updates an existing animal profile.

- **Endpoint**: `PUT /animals/:id`
- **Content-Type**: `multipart/form-data` or `application/json`

### Request Body
Supports the same fields as the Create endpoint. For file uploads, use `multipart/form-data`.

---

## 3. List Inventory (Dashboard)
Retrieves a list of animals with filtering and pagination.

- **Endpoint**: `GET /animals`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by status (e.g., "all", "AVAILABLE")
  - `species`: Filter by species
  - `breed`: Filter by breed

### Response (200 OK)
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Buddy",
      "status": "AVAILABLE",
      "photos": [{ "photo_url": "...", "is_main": true }]
    }
  ],
  "total": 42,
  "pages": 5
}
```

---

## 4. Archive Animal
Marks an animal as archived (soft delete).

- **Endpoint**: `DELETE /animals/:id`

---

## Error Responses
| Code | Description |
|------|-------------|
| 400 | Validation error (e.g., missing mandatory fields) |
| 401 | Unauthorized (Missing or invalid token) |
| 403 | Forbidden (Incorrect role) |
| 404 | Animal not found |
