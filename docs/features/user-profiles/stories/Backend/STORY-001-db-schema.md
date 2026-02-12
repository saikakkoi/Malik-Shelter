# STORY-001: Database Schema Extension

**Epic:** EPIC-002 - Adopter User Profiles  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a Developer,  
I want to extend the Prisma schema with AdopterProfile and AdopterHomePhoto models,  
So that we can store comprehensive adopter details and environment photos.

## Description
This story involves updating the `schema.prisma` file with the new entities defined in the ERD Extension. It also includes running the initial migration to apply these changes to the SQLite database.

## Acceptance Criteria
```gherkin
GIVEN the current Prisma schema
WHEN I add the AdopterProfile and AdopterHomePhoto models
AND run 'npx prisma migrate dev'
THEN the database tables are created with the correct relations

GIVEN the AdopterProfile model
WHEN I check the relations
THEN it has a 1:1 relation with the User model using user_id as PK
AND it has a 1:N relation with AdopterHomePhoto
```

## Business Rules
- **BR-1:** Every adopter must have exactly one profile.
- **BR-2:** AdopterHomePhoto entries must be linked to a valid AdopterProfile.

## Technical Notes
- Mirror the `StaffProfile` pattern for the 1:1 relation.
- Ensure `user_role` in `User` model supports 'ADOPTER'.

## Traceability
- **FSD Reference:** Section 6.1 (Data Entities)
- **ERD Reference:** [ERD Extension](../../erd-extension.md)
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** None (Foundational)
- **Blocks:** STORY-003-profile-api
