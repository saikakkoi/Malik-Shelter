# UI Wireframes: Animal Management

## Executive Summary
This document outlines the UI extensions for the existing Animal Management module. We will extend the current **Pet Inventory** dashboard with "Add" and "Edit" capabilities and implement a comprehensive multi-section form for data entry.

## Screen Inventory
| Screen | Priority | Complexity | Key Features |
|--------|----------|------------|--------------|
| Animal Dashboard | High | Medium | Search, filters, status overview, quick actions |
| Add/Edit Animal Form | High | High | Multi-section fields, photo upload, validation |
| Animal Profile View | Medium | Low | Summary of all data for internal review |

---

## Screen: Animal Dashboard
**Purpose:** Central hub for staff to manage all animals.

┌─────────────────────────────────────────────────────────┐
│ [Logo]  Search: [____________]  Filters: [Status ▼] [+]Add │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Total: 42 Animals]                                     │
│                                                          │
│  [ Photo ]  [ Name/Breed ]      [ Status ]    [ Actions ]│
│  ┌───────┐  ┌────────────┐      ┌────────┐    ┌─────────┐│
│  │ Image │  │ Buddy      │      │ Active │    │ Edit | X││
│  └───────┘  │ Golden Ret.│      └────────┘    └─────────┘│
│                                                          │
│  [ Photo ]  [ Name/Breed ]      [ Status ]    [ Actions ]│
│  ┌───────┐  ┌────────────┐      ┌────────┐    ┌─────────┐│
│  │ Image │  │ Luna       │      │ Adopted│    │ Edit | X││
│  └───────┘  │ Siamese    │      └────────┘    └─────────┘│
│                                                          │
├─────────────────────────────────────────────────────────┤
│ [ < Prev ] [ 1 ] [ 2 ] [ 3 ] [ Next > ]                  │
└─────────────────────────────────────────────────────────┘

---

## Screen: Add/Edit Animal Form
**Purpose:** Detailed data entry for animal profiles.

┌─────────────────────────────────────────────────────────┐
│ [< Back]  New Animal Arrival                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  SECTION 1: BASIC PROFILE                                │
│  Name: [__________]  Type: [Dog ▼]  Breed: [__________]  │
│  Gender: ( ) M  ( ) F   Age: [___] yrs   Weight: [___] kg│
│                                                          │
│  SECTION 2: PHOTOS (Max 5MB each)                        │
│  [ + Upload Photo ]  [IMAGE] [IMAGE] [X]                 │
│                                                          │
│  SECTION 3: BACKGROUND                                   │
│  Bio: [____________________________________]             │
│  Origin: [_________________________________] (Free-text) │
│                                                          │
│  SECTION 4: MEDICAL                                      │
│  Sterilized: [Yes ▼]  Diet: [________________]           │
│  Conditions: [_______________________________]           │
│                                                          │
│  SECTION 5: PERSONALITY                                  │
│  Energy: 1 [ ● ● ● ○ ○ ] 5                               │
│  Social: [ ] Humans  [ ] Dogs  [ ] Cats  [ ] Kids        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ [ Cancel ]                                   [ Save Pet ]│
└─────────────────────────────────────────────────────────┘

## Component Specifications

| Component | Type | Behavior |
|-----------|------|----------|
| Photo Upload | Drag-and-drop / Browser | Validates 5MB limit before upload. |
| Energy Level | Rating Stars/Dots (1-5) | Visual representation of energy. |
| Social Compatibility | Multi-checkbox | Tags for search filtering. |
| Origin | Textarea | Free-form narrative input. |

## Responsive Behavior
- **Desktop**: Full 5-section form layout.
- **Mobile**: Single column, accordion-style sections to reduce scrolling fatigue.
