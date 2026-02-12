# STORY-005: Staff Review API

**Epic:** EPIC-002 - Adopter User Profiles  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As a Staff Member,  
I want to retrieve an adopter's full profile details by ID,  
So that I can review their application for a visit request.

## Description
Implementation of the `GET /adopters/{id}` endpoint. This endpoint allows staff to see all adopter details, including encrypted PII fields (decrypted for staff view) and home photos.

## Acceptance Criteria
```gherkin
GIVEN I am a Staff member
WHEN I call GET /adopters/{id}
THEN I see the full AdopterProfile including all steps and photos

GIVEN I am an Adopter
WHEN I attempt to call GET /adopters/{other_id}
THEN I receive a 403 Forbidden error
```

## Business Rules
- **BR-1:** Access restricted to roles: STAFF, ADMIN.
- **BR-2:** PII data must be decrypted before returning to staff.

## Technical Notes
- Use RBAC middleware to enforce 'STAFF' role.
- Call `EncryptionUtility.decrypt()` on sensitive fields.

## Traceability
- **FSD Reference:** FR-005
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-003-profile-api
- **Blocks:** None (used in staff dashboard)
