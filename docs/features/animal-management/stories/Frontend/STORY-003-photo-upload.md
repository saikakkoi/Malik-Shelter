# STORY-003: Multi-Photo Upload & 5MB Validation

**Epic:** EPIC-001 - Animal Management System  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a Staff member,  
I want to upload multiple photos of an animal and have the system validate their size,  
So that I can showcase the animal correctly while staying within system limits.

## Description
Adding a photo upload component to the `AnimalForm.vue`. It must support selecting up to 5 files, showing local previews, and enforcing the 5MB per file limit.

## Acceptance Criteria
```gherkin
GIVEN I am in the Photos section of the form
WHEN I select one or more image files
THEN I see thumbnail previews of the selected images

GIVEN I select a file larger than 5MB
WHEN the file is selected
THEN the system displays an error "File size exceeds 5MB limit" and rejects the file

GIVEN I have uploaded the maximum of 5 photos
WHEN I try to add another
THEN the system prevents the action per BR-003
```

## Business Rules
- **BR-003**: 5MB size limit per photo.
- Limit to 5 photos total.

## Technical Notes
- Use `URL.createObjectURL` for local previews.
- Validate `file.size` in the `change` event.

## Traceability
- **FSD Reference:** FR-003
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-002
- **Blocks:** STORY-004
