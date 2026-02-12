# STORY-008: Profile Wizard: Step 2 (Housing & Photos)

**Epic:** EPIC-002 - Adopter User Profiles
**Role:** Frontend
**Story Points:** 5
**Priority:** Must Have

---

## User Story
As an Adopter,
I want to document my housing situation and upload environment photos,
So that I can demonstrate a suitable environment for a pet.

## Description
Implementation of Step 2 of the Profile Wizard. This screen includes dynamic field rendering (e.g., showing the permit upload only if 'Rent' is selected) and the photo gallery uploader.

## Acceptance Criteria
```gherkin
GIVEN I am on Step 2
WHEN I select 'Rent' as my ownership status
THEN the 'Landlord Permit' upload field becomes visible

GIVEN I upload a photo
WHEN the upload completes
THEN I see a thumbnail preview in the gallery

GIVEN I attempt to proceed with 0 photos
WHEN I click 'Next'
THEN the field is marked as invalid (minimum 2 photos required for completion)
```

## Business Rules
- **BR-001**: Rental Permit Requirement (Conditional visibility).
- **BR-002**: Photo Minimum (>= 2 for completion).

## Technical Notes
- Use `multipart/form-data` for the `POST /me/profile/photos` call.
- Implement client-side photo resizing if possible to save bandwidth.

## Traceability
- **FSD Reference**: FR-001, FR-003
- **Epic**: EPIC-002

## Dependencies
- **Depends On**: STORY-004-photo-upload (Backend)
- **Blocks**: STORY-012-gating-logic
