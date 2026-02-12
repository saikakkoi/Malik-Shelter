# STORY-009: Profile Wizard: Step 3 (Household)

**Epic:** EPIC-002 - Adopter User Profiles  
**Role:** Frontend  
**Story Points:** 2  
**Priority:** Must Have

---

## User Story
As an Adopter,  
I want to provide details about my household and existing pets,  
So that the shelter can assess compatibility with new animals.

## Description
Third step of the Wizard. Fields: Resident Count, Children presence/ages, Allergies, Existing pets (Species/Count).

## Acceptance Criteria
```gherkin
GIVEN I am on Step 3
WHEN I update my household details and click "Next"
THEN the data is saved
AND I am navigated to Step 4
```

## Business Rules
- **BR-1:** Resident Count must be >= 1.

## Technical Notes
- Simple form fields with numeric inputs and text areas for details.

## Traceability
- **FSD Reference:** FR-001
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-003-profile-api
- **Blocks:** None
