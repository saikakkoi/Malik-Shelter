# UI Wireframes: Adopter User Profiles

## 1. Executive Summary
- **Product Overview**: Malik Shelter Adopter Profile system.
- **Key User Personas**: 
    - **New Adopter**: Needs to provide details to qualify for adoptions.
    - **Returning Adopter**: Updating existing profile details.
    - **Shelter Staff**: Reviewing completed profiles for approval.
- **Primary User Journeys**: Profile creation wizard (5 steps) and Profile Management Dashboard.
- **Screen Count**: 7 (Dashboard + 5 Wizard Steps + Review View).
- **Complexity Assessment**: Medium (High interaction complexity for photo uploads and multi-step validation).

---

## 2. Information Architecture

### Sitemap
- **Dashboard** (/profile)
    - **Identity & Contact** (/profile/step-1)
    - **Housing & Environment** (/profile/step-2)
    - **Household & Allergies** (/profile/step-3)
    - **Experience & References** (/profile/step-4)
    - **Lifestyle & Activity** (/profile/step-5)

### User Flow
1. Adopter logs in and is redirected to Dashboard.
2. Dashboard shows "Incomplete" status and CTA "Complete Profile".
3. User navigates through Steps 1-5, with "Save & Next" on each.
4. After Step 5, system runs a completeness check.
5. If success, status updates to "Verified" and "Request Visit" becomes enabled on pet pages.

---

## 3. Screen Inventory

| Screen | Priority | Complexity | Related Entities | Key APIs (Anticipated) |
|--------|----------|------------|------------------|----------|
| Profile Dashboard | High | Low | Adopter | `GET /me/profile` |
| Step 1: Identity | High | Low | Adopter | `PATCH /me/profile/identity` |
| Step 2: Housing | High | Medium | Adopter, ResidencePhoto | `PATCH /me/profile/housing`, `POST /me/profile/photos` |
| Step 3: Household | High | Low | Adopter | `PATCH /me/profile/household` |
| Step 4: Experience | High | Medium | Adopter, Reference | `PATCH /me/profile/experience` |
| Step 5: Lifestyle | High | Low | Adopter | `PATCH /me/profile/lifestyle` |
| Staff Review View | Medium | Medium | Adopter | `GET /admin/adopters/:id` |

---

## 4. Wireframes

### Screen: Profile Dashboard
**Purpose**: Central hub for adopters to see their profile status and jump into wizard steps.

**Wireframe Description**:
┌─────────────────────────────────────────────────────────┐
│  [Logo] [Discovery] [Adoptions] [ProfileIcon]           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  # Your Adopter Profile                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Status: [Incomplete / Complete] [Progress Bar 40%] │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ [Identity]  │  │ [Housing]   │  │ [Household] │       │
│  │ (Done)       │  │ (Incomplete)│  │ (Locked)    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                          │
│  [Continue Wizard Button]                                │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [Footer]                                                │
└─────────────────────────────────────────────────────────┘

---

### Screen: Step 2: Housing & Environment
**Purpose**: Collect residence details and environment photos.

**Wireframe Description**:
┌─────────────────────────────────────────────────────────┐
│  [< Back to Dashboard]          [Step 2 of 5: Housing]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ### Where will the pet live?                            │
│                                                          │
│  Housing Type: [Dropdown: House/Apartment/Other]         │
│  Ownership: [Radio: Own / Rent]                          │
│  [If Rent: Upload Landlord Permit Button]                │
│                                                          │
│  Outdoor Area: [Radio: Fenced / Unfenced / None]         │
│                                                          │
│  ### Environment Photos                                  │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ [ + Upload ]     │  │ [ + Upload ]     │              │
│  │ Inside View      │  │ Outside Area     │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [Save & Exit]                      [Save & Continue >]  │
└─────────────────────────────────────────────────────────┘

**Form Fields**:
| Field | Type | Validation |
|-------|------|------------|
| Residence Type | Dropdown | Required |
| Ownership | Radio | Required |
| Outdoor Area | Radio | Required |
| Photos | File Upload | Min 2 photos required for 'Complete' status |

---

## 5. Interaction Patterns
- **Progressive Persistence**: Data is saved on clicking "Next" or "Save & Exit".
- **Dynamic Fields**: "Landlord Permit" upload field only appears if "Rent" is selected.
- **Micro-interactions**: Photo upload shows a progress bar and thumbnail preview upon success.

---

## 6. Traceability Matrix
| User Story (PRD) | Screen | Key Actions |
|------------------|--------|-------------|
| US-P1 | Step 1, Step 2 | Input identity and residence details |
| US-P2 | Step 4 | Input vet references |
| US-P3 | Dashboard, Pet Detail | Check completeness flag before visit request |

---

## 7. Responsive Behavior
- **Mobile**: Wizard steps collapse to a single column. Buttons become full-width at the bottom.
- **Desktop**: 1200px max-width container, side-by-side photo uploads.
