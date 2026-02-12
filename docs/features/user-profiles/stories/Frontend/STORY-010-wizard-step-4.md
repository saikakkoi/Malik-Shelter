# STORY-010: Profile Wizard: Step 4 (Experience)

**Epic:** EPIC-002 - Adopter User Profiles  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an Adopter,  
I want to provide my pet ownership history and vet references,  
So that the shelter can verify my experience as a pet owner.

## Description
Fourth step of the Wizard. Fields: Ownership history (previous pets), Vet references (Name, Clinic, Phone).

## Acceptance Criteria
```gherkin
GIVEN I am on Step 4
WHEN I enter my vet reference and ownership narrative
AND click "Next"
THEN the data is saved
AND I am navigated to Step 5
```

## Business Rules
- **BR-1:** Ownership history narrative is required.

## Technical Notes
- Multi-line text area for ownership history.
- Validation for vet phone/email.

## Traceability
- **FSD Reference:** FR-001, US-P2
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-003-profile-api
- **Blocks:** None
