# STORY-012: Gating Logic: Visit Requests

**Epic:** EPIC-002 - Adopter User Profiles
**Role:** Frontend
**Story Points:** 5
**Priority:** Must Have

---

## User Story
As the Shelter,
We want to block visit requests from adopters with incomplete profiles,
So that staff time is only spent on qualified applicants.

## Description
Implementation of the gating logic on the Pet Detail page. The "Request Visit" button must be dynamically disabled based on the user's `is_complete` profile status.

## Acceptance Criteria
```gherkin
GIVEN I have an incomplete profile (status: 'DRAFT')
WHEN I view a pet profile
THEN the "Request Visit" button is disabled
AND a message says "Please complete your profile to request visits"

GIVEN I have a complete profile (status: 'COMPLETED')
WHEN I view a pet profile
THEN the "Request Visit" button is enabled
```

## Business Rules
- **BR-GATE-01**: Access to visit scheduling is dependent on profile verification status.

## Technical Notes
- Use a global `useAuth` or `useProfile` hook to check the `is_complete` status.
- Add a server-side check on the `POST /adoption-requests` endpoint as a fallback.

## Traceability
- **FSD Reference**: FR-004
- **Epic**: EPIC-002

## Dependencies
- **Depends On**: STORY-003-profile-api
- **Blocks**: None
