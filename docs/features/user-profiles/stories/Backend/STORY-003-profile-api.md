# STORY-003: Profile CRUD API

**Epic:** EPIC-002 - Adopter User Profiles
**Role:** Backend
**Story Points:** 8
**Priority:** Must Have

---

## User Story
As an Adopter,
I want to save my profile information step-by-step,
So that I can complete my "resumé" for adoption requests.

## Description
Implementation of the `GET /me/profile` and `PATCH /me/profile` endpoints. This includes the logic to calculate completion percentage and missing fields based on the FSD requirements.

## Acceptance Criteria
```gherkin
GIVEN I am an authenticated Adopter
WHEN I call GET /me/profile
THEN I see my current data + completionMeta (percentage, isComplete, missingFields)

GIVEN I am on Step 1 of the Wizard
WHEN I PATCH /me/profile with identity details
THEN the database is updated and my completion percentage increases

GIVEN I am Staff
WHEN I attempt to PATCH /me/profile
THEN I receive a 403 Forbidden error
```

## Business Rules
- **BR-COMP-01**: Profiles start as 'DRAFT' and only switch to 'COMPLETED' when all mandatory fields are present.

## Technical Notes
- Use Prisma's `upsert` to handle initial profile creation.
- Integrate with `STORY-002` for automatic field encryption during PATCH.

## Traceability
- **FSD Reference**: FR-002, FR-004
- **Epic**: EPIC-002

## Dependencies
- **Depends On**: STORY-001-db-schema, STORY-002-pii-encryption
- **Blocks**: STORY-006 to 011 (Frontend)
