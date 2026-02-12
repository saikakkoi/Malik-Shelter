# STORY-011: Profile Wizard: Step 5 (Lifestyle)

**Epic:** EPIC-002 - Adopter User Profiles  
**Role:** Frontend  
**Story Points:** 2  
**Priority:** Must Have

---

## User Story
As an Adopter,  
I want to provide information about my daily routine and activity level,  
So that the shelter knows if I can meet a specific pet's needs.

## Description
Final step of the Wizard. Fields: Time pet will spend alone, Activity level (Low/Medium/High), Future plans (Moving, etc.).

## Acceptance Criteria
```gherkin
GIVEN I am on Step 5
WHEN I complete the lifestyle fields and click "Submit Profile"
THEN the final data is saved
AND the profile status is recalculated
AND I am redirected to the Dashboard with a success message
```

## Business Rules
- **BR-1:** Time spent alone and activity level are mandatory.

## Technical Notes
- Radio buttons for activity level.
- Select/Dropdown for time spent alone.

## Traceability
- **FSD Reference:** FR-001
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-003-profile-api
- **Blocks:** STORY-012-gating-logic
