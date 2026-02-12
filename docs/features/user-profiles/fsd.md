# Functional Specification Document: Adopter User Profiles

## Document Information
- **Document Title**: Functional Specification - Adopter User Profiles
- **Version**: 1.0
- **Date**: 2026-02-11
- **PRD Reference**: [PRD Addendum (Adopter User Profiles)](file:///d:/Dyta/BZ/pet-adopt/docs/features/user-profiles/prd-addendum.md)
- **Author**: AI Assistant

---

## 1. Executive Summary
The Adopter User Profiles system provides a structured, multi-step process for prospective adopters to document their lifestyle, housing conditions, and pet experience. The system acts as a prerequisite gatekeeper, ensuring all required information is captured and validated before an adopter can request a shelter visit. This reduces staff administrative burden and improves the quality of pet-adopter matching.

---

## 2. Scope

### 2.1 In Scope
- A 5-step Profile Wizard for data entry.
- Progress tracking and "Save as Draft" functionality.
- Environmental photo upload and management.
- Backend profile persistence with PII protection.
- Profile completeness validation engine.
- Staff-facing adopter profile detail view.

### 2.2 Out of Scope
- Integration with third-party background check services.
- Real-time communication between adopters and staff within the profile module.
- Automated scoring or algorithmic matching (manual review only).

### 2.3 Assumptions
- Users must be authenticated as an "ADOPTER" to access the profile wizard.
- File storage for photos is already configured and secure.
- Adopters are willing to provide detailed personal information for the benefit of the adoption process.

### 2.4 Dependencies
- **User Authentication**: Must successfully identify the logged-in user and their role.
- **ERD Extension**: Completion of the new database models for AdopterProfile.
- **File Storage**: Availability of an object storage service for home photos.

---

## 3. User Roles & Permissions

| Role | Description | Key Capabilities |
|------|-------------|------------------|
| Adopter | Prospective pet owner | Create/Edit own profile, upload home photos, view completion status. |
| Staff | Shelter operational staff | Read-only access to all adopter profiles, verify environment photos. |
| Admin | Shelter manager | Read/Write access for system configuration (not typically profile data). |

---

## 4. Functional Requirements

### 4.1 Profile Management (Self-Service)

#### FR-001: Profile Wizard Navigation
- **Description:** System shall provide a 5-step guided wizard for profile data entry.
- **Priority:** Must Have
- **PRD Reference:** User Flow Section
- **User Story:** As an Adopter, I want to be guided through the profile creation process so that I don't miss any required information.
- **Acceptance Criteria:**
  - [ ] Given I am on Step 1, when I click "Next", then I am navigated to Step 2 if Step 1 is valid.
  - [ ] Given I am on Step 2-5, when I click "Back", then I am navigated to the previous step.
  - [ ] System shall display a progress indicator (e.g., "Step 2 of 5").

#### FR-002: Save as Draft
- **Description:** System shall automatically save profile data when moving between steps or clicking "Save & Exit".
- **Priority:** Must Have
- **PRD Reference:** US-P1
- **User Story:** As an Adopter, I want my progress saved so that I can complete the profile over multiple sessions.
- **Acceptance Criteria:**
  - [ ] Given I have filled some fields, when I click "Save & Exit", then the data is persisted in the database.
  - [ ] When I return to the profile page, the system shall restore my last saved state.

#### FR-003: Home Photo Uploads
- **Description:** System shall allow adopters to upload multiple photos of their living environment.
- **Priority:** Must Have
- **PRD Reference:** Section 5.1 (Housing)
- **User Story:** As an Adopter, I want to upload photos of my home so that staff can verify my living conditions.
- **Acceptance Criteria:**
  - [ ] Given I am on Step 2, when I upload a valid image (JPG/PNG < 5MB), then the photo is associated with my profile.
  - [ ] System shall allow deleting uploaded photos.
  - [ ] System shall require at least 2 environment photos for "Complete" status.

#### FR-004: Completeness Validation
- **Description:** System shall calculate profile completeness and block visit requests for incomplete profiles.
- **Priority:** Must Have
- **PRD Reference:** US-P3
- **User Story:** As an Adopter, I want to know if my profile is ready so that I can proceed with requesting visits.
- **Acceptance Criteria:**
  - [ ] Given my profile is missing mandatory fields, when I view a pet profile, then the "Request Visit" button is disabled with a tooltip explaining why.
  - [ ] System shall define mandatory fields: Full Name, Address, Phone, Residence Type, Ownership, Outdoor Area, Resident Count, at least 2 Photos.

---

### 4.2 Staff Review View

#### FR-005: Adopter Profile Review
- **Description:** System shall provide a read-only detailed view of an adopter's profile for staff review.
- **Priority:** Must Have
- **PRD Reference:** US-S5
- **User Story:** As Staff, I want to review an adopter's history and home details so that I can approve or reject a visit request.
- **Acceptance Criteria:**
  - [ ] Given I am reviewing a visit request, when I click the "View Adopter" link, then I see all 5 profile sections.
  - [ ] System shall display home photos in a gallery view for easy inspection.

---

## 5. Business Rules Catalog

| ID | Rule | Applies To | Validation |
|----|------|------------|------------|
| BR-001 | Rental Permit Requirement | Step 2 (Housing) | If Ownership = 'Rent', then 'Landlord Permit URL' becomes mandatory. |
| BR-002 | Photo Minimum | Profile Status | Total photos in `AdopterHomePhoto` must be >= 2 for status to be 'COMPLETED'. |
| BR-003 | PII Privacy | Staff View | Staff shall see all data, but only for active adoption requests (Access Control). |

---

## 6. Data Specifications

### 6.1 Data Entities

#### AdopterProfile (See ERD Extension for full list)
| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| full_name | String | Yes | Min 2 chars |
| phone | String | Yes | Valid international format |
| residence_type | Enum | Yes | One of: House, Apartment, Studio, Other |
| ownership_status| Enum | Yes | One of: OWN, RENT |
| resident_count| Int | Yes | Min 1 |

---

## 7. Interface Specifications

### 7.1 User Interface Requirements
- **Wizard Design**: Minimalist, step-by-step UI with clear validation feedback.
- **Progress Bar**: Persistent indicator of profile completion.
- **Photo Thumbnails**: Immediate visual feedback after image upload.

### 7.2 API Specifications (See API Contract)
- `GET /v1/me/profile`: Fetches profile + meta (completion %).
- `PATCH /v1/me/profile`: Partial updates per wizard step.
- `POST /v1/me/profile/photos`: Upload with multipart/form-data.

---

## 10. Traceability Matrix

| PRD Item | FSD Requirement(s) | Priority |
|----------|-------------------|----------|
| US-P1 (Identity/Housing) | FR-001, FR-002 | Must Have |
| US-P2 (Experience) | FR-001, FR-002 | Must Have |
| 5.1 (Photos) | FR-003, BR-002 | Must Have |
| US-P3 (Completeness) | FR-004 | Must Have |
| US-S5 (Staff Review) | FR-005, BR-003 | Must Have |

---

## 11. Appendices

### A. Glossary
- **PII**: Personally Identifiable Information.
- **Gating**: Blocking a user from a specific action (Requesting Visit) until a condition is met (Profile Complete).
- **Draft Status**: A profile that has some data but doesn't yet meet all mandatory validation rules.

### B. Open Questions
- **OQ1**: Do we need to verify vet references via an automated email or remains strictly manual? (Currently manual).
- **OQ2**: Should photo descriptions be mandatory? (Currently optional).
