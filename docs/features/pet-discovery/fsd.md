# Functional Specification Document (FSD): Pet Discovery & Management

## Document Information
*   **Version**: 1.0
*   **Subject**: Pet Discovery (Search, Filter, Profile) & Staff Inventory Management
*   **PRD Reference**: `docs/features/pet-discovery/prd-addendum.md`

## 1. Executive Summary
This document specifies the functional requirements for the "Pet Discovery & Management" module. It covers the public-facing features for adopters to find pets (Search, Filtration, Detailed Profiles) and the internal interfaces for staff to manage animal inventory (CRUD, Media Upload).

## 2. Scope
### 2.1 In Scope
*   Public Animal Search with Filters (Species, Breed, Gender, Age, Traits).
*   Public Animal Detail View (Profile, Photos, Medical Summary, Recommendations).
*   Staff Animal Inventory Dashboard (List, Sort, Filter).
*   Staff Animal Editor (Create, Update, Archive, Photo Upload).
*   System-generated content (Availability status logic).

### 2.2 Out of Scope
*   Online Adoption Application (Next Feature).
*   Visit Scheduling (Next Feature).
*   Staff User Management (Handled in Global Auth).

## 3. User Roles
| Role | Key Capabilities |
| :--- | :--- |
| **Adopter** (Public) | Search/Filter animals, View details, View medical summary ( redacted), View gallery. |
| **Staff** (Admin) | Create/Edit animals, Upload photos, View full medical details, Change status. |

## 4. Functional Requirements

### 4.1 Public Search & Listing
#### FR-001: Animal Filtration
*   **Description**: Users can filter the animal list by specific criteria.
*   **Priority**: Must Have.
*   **Acceptance Criteria**:
    *   [ ] Multi-select for `Species` (Cat, Dog).
    *   [ ] Single-select for `Gender` (Male, Female).
    *   [ ] Range slider or inputs for `Age`.
    *   [ ] Multi-select for `Personality Traits` (AND/OR logic defined in API).
*   **Business Rules**:
    *   BR-001: Only animals with status `AVAILABLE` or `PENDING` are shown. `ADOPTED`/`ARCHIVED` are hidden by default unless deep-linked.

#### FR-002: Lottie Loading State
*   **Description**: Display custom Lottie animation during data fetch.
*   **Priority**: Should Have.
*   **Acceptance Criteria**:
    *   [ ] "Cat Mark" animation plays while `GET /animals` is pending.

### 4.2 Animal Profile
#### FR-003: Detailed Information Display
*   **Description**: Show comprehensive animal data including bio, physical stats, and background.
*   **Priority**: Must Have.
*   **Acceptance Criteria**:
    *   [ ] Origin story is visible.
    *   [ ] Weight displayed in kg.
    *   [ ] "Vaccinated" and "Sterilized" badges shown.

#### FR-004: Photo Gallery
*   **Description**: Carousel of high-quality images.
*   **Priority**: Must Have.
*   **Acceptance Criteria**:
    *   [ ] Main image loads first.
    *   [ ] Thumbnails for secondary images.
    *   [ ] Click to expand/zoom.

#### FR-005: Recommended Pets
*   **Description**: Suggest 3 other animals based on matching traits.
*   **Priority**: Could Have.
*   **Logic**: Same `Species` + Max matching `Personality Traits`.

### 4.3 Staff Management
#### FR-006: Animal CRUD
*   **Description**: Staff can add, update, and manage animal records.
*   **Priority**: Must Have.
*   **Acceptance Criteria**:
    *   [ ] Form validation (Name required, Age > 0).
    *   [ ] Status change (e.g., AVAILABLE -> ADOPTED) triggers audit log.

#### FR-007: Photo Upload
*   **Description**: Upload and reorder photos.
*   **Priority**: Must Have.
*   **Acceptance Criteria**:
    *   [ ] Drag-and-drop interface.
    *   [ ] Max file size 5MB.
    *   [ ] Auto-resize/optimize on server (Technical Requirement).

## 5. Data Specifications (Field Level)

| Entity | Field | Type | Required | Validation/Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Animal** | `name` | String | Yes | Max 50 chars. |
| | `species` | Enum | Yes | Cat, Dog. |
| | `age_months` | Int | Yes | Min 0, Max 360 (30 yrs). |
| | `weight_kg` | Float | No | Min 0.1, Max 100. |
| | `status` | Enum | Yes | Default: AVAILABLE. |
| **Photo** | `url` | URL | Yes | Secure HTTPS. |
| | `is_main` | Bool | Yes | One per animal must be true. |

## 6. Interface Requirements
*   **Search Page**: Sidebar filters (Desktop) / Slide-over (Mobile).
*   **Grid layout**: Responsive Masonry (2 col Mobile, 3 col Tablet, 4 col Desktop).

## 7. Traceability Matrix
| PRD Item | FSD Requirement | Priority |
| :--- | :--- | :--- |
| Adopter Search | FR-001 | P0 |
| Profile View | FR-003, FR-004 | P0 |
| Loading Anim | FR-002 | P1 |
| Staff Dashboard | FR-006 | P0 |
| Photo Mgmt | FR-007 | P0 |
