# STORY-004: API Integration: Create & Edit Pet

**Epic:** EPIC-001 - Animal Management System  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a Staff member,  
I want my form submissions to be saved to the database and I want to edit existing pets,  
So that the digital inventory is always accurate and up-to-date.

## Description
Connecting the `AnimalForm.vue` to the backend `POST /animals` and `PUT /animals/:id` endpoints. This includes handling `multipart/form-data` for photo uploads.

## Acceptance Criteria
```gherkin
GIVEN I have filled out the creation form correctly
WHEN I click "Save Pet"
THEN the system sends a POST request with FormData and redirects to inventory on success

GIVEN I click "Edit" on an existing animal in the dashboard
WHEN the form loads
THEN it is pre-populated with the animal's current data

GIVEN I modify fields and click "Save"
WHEN the request is sent
THEN the system triggers a PUT request and updates the record
```

## Business Rules
- All schema validations from FSD Section 6.

## Technical Notes
- Use `FormData` API to combine JSON fields and File objects.
- Ensure `Authorization` header with JWT is included.

## Traceability
- **FSD Reference:** FR-002, FR-005
- **API Reference:** POST /animals, PUT /animals/:id
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-002, STORY-003
- **Blocks:** STORY-005
