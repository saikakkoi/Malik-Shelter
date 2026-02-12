# STORY-013: Profile Integration Tests

**Epic:** EPIC-002 - Adopter User Profiles  
**Role:** Others  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a QA Engineer,  
I want to run integration tests that cover the full profile lifecycle,  
So that we ensure data integrity and validation rules are working as expected.

## Description
Creation of end-to-end integration tests (using Vitest/Supertest for backend and Cypress/Playwright for frontend). Tests must verify the completeness calculation, encryption/decryption, and gating logic.

## Acceptance Criteria
```gherkin
GIVEN a new Adopter user
WHEN I run the automated profile flow test
THEN it successfully creates a profile through all 5 steps
AND verifies that PII is encrypted in the DB
AND verifies that the profile status is marked 'COMPLETED' at the end

GIVEN an incomplete profile
WHEN the automated test attempts a visit request
THEN the request is rejected with a 403 error
```

## Technical Notes
- Use a dedicated test database (SQLite in-memory or separate file).
- Mock storage service for photo uploads.

## Traceability
- **FSD Reference:** Section 10 (Traceability)
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-003-profile-api, STORY-012-gating-logic
- **Blocks:** Deployment
