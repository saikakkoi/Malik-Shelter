# STORY-006: Adopter Profile Dashboard

**Epic:** EPIC-002 - Adopter User Profiles  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an Adopter,  
I want to see the status of my profile and its completion progress,  
So that I know what information I still need to provide.

## Description
Implementation of the `/profile` landing page. It displays the current completion percentage, status badge (Draft/Completed), and list of wizard steps with their current state (Done/Incomplete).

## Acceptance Criteria
```gherkin
GIVEN I have not started my profile
WHEN I visit /profile
THEN I see 0% progress and a "Start Profile" button

GIVEN my profile is 40% complete
WHEN I visit /profile
THEN the progress bar reflects 40%
AND the completed steps are marked with a checkmark
```

## Business Rules
- **BR-1:** Completion percentage is calculated based on mandatory fields.

## Technical Notes
- Use the `meta` object from `GET /me/profile` for progress tracking.
- Navigation links to individual wizard steps.

## Traceability
- **FSD Reference:** FR-001, FR-004
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-003-profile-api
- **Blocks:** None
