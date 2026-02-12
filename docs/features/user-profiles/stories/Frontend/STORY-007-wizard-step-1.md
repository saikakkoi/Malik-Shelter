# STORY-007: Profile Wizard: Step 1 (Identity)

**Epic:** EPIC-002 - Adopter User Profiles  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an Adopter,  
I want to provide my basic contact and identity information,  
So that the shelter knows who I am.

## Description
First step of the Profile Wizard. Fields: Full Name, Phone, Physical Address, Occupation.

## Acceptance Criteria
```gherkin
GIVEN I am on Step 1
WHEN I enter valid identity data and click "Next"
THEN my data is saved to the backend via PATCH /me/profile
AND I am navigated to Step 2

GIVEN I leave blank a mandatory field (e.g., Full Name)
WHEN I click "Next"
THEN I see a validation error and cannot proceed
```

## Business Rules
- **BR-1:** All fields in Step 1 are mandatory for 'COMPLETED' status.

## Technical Notes
- Use reactive state to track form inputs.
- Client-side validation using Vuelidate or similar.

## Traceability
- **FSD Reference:** FR-001, FR-002
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-003-profile-api
- **Blocks:** None
