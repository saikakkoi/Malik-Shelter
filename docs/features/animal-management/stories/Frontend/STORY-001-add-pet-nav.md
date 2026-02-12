# STORY-001: Add Pet Button & Navigation

**Epic:** EPIC-001 - Animal Management System  
**Role:** Frontend  
**Story Points:** 2  
**Priority:** Must Have

---

## User Story
As a Staff member,  
I want to have a clear "Add Pet" button on the inventory dashboard,  
So that I can quickly begin the intake process for a new animal.

## Description
This story involves updating the existing `Inventory.vue` page to include a primary action button that navigates the user to the new animal creation form.

## Acceptance Criteria
```gherkin
GIVEN I am on the Pet Inventory dashboard
WHEN I look at the header section
THEN I see a clearly labeled "+ Add Pet" button

GIVEN I click the "+ Add Pet" button
WHEN the action is triggered
THEN I am navigated to the /staff/inventory/new page (or similar modal/view)
```

## Business Rules
- None for this navigation step.

## Technical Notes
- Update `Inventory.vue` template.
- Ensure the button matches the existing design system (Accent color).

## Traceability
- **FSD Reference:** FR-001
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** None
- **Blocks:** STORY-002
