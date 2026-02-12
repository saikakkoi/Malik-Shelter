# Functional Specification Document (FSD): Adoption Flow

## Document Information
- **Title**: Adoption Flow Functional Specification
- **Version**: 1.0
- **Date**: 2026-02-12
- **PRD Reference**: [prd-addendum.md](file:///d:/Dyta/BZ/pet-adopt/docs/features/adoption-flow/prd-addendum.md)
- **Author**: Antigravity

---

## 1. Executive Summary
The Adoption Flow module manages the end-to-end journey of a visit request, from initial booking by the adopter to final approval and adoption by staff. It ensures transparent communication, prevents overbooking of visit slots, and automates cleanup when a pet is successfully adopted.

## 2. Scope
### 2.1 In Scope
- Adopter-facing visit scheduling using fixed daily slots and a calendar.
- Staff-facing adoption request management (approve/reject).
- Visit check-in and documentation (Visit Notes).
- Automated rejection of concurrent requests upon final adoption.
- Cancellation window enforcement for adopters.
- Settings interface for managing fixed daily slot templates.

### 2.2 Out of Scope
- Dynamic hour-by-hour staff scheduling.
- Automated background checks for adopters.
- Automated reminders for upcoming visits.

### 2.3 Assumptions
- Adopters must have a complete profile to submit a visit request.
- Staff are responsible for physically verifying adopters during the visit.

### 2.4 Dependencies
- **User Profile Service**: For profile completeness checks.
- **Animal Inventory**: For animal status updates and concurrency locks.
- **Notification System**: For status change alerts.

## 3. User Roles & Permissions
| Role | Description | Key Capabilities |
|------|-------------|------------------|
| ADOPTER | Prospective pet owner | Search pets, request/cancel visits (within window). |
| STAFF | Shelter operational user | Manage requests, check-in visits, finalize adoptions, manage slot templates. |

---

## 4. Functional Requirements

### 4.1 Visit Scheduling (Adopter)
#### FR-AF-001: Slot Selection & Submission
- **Description:** System shall allow adopters to pick a date from a calendar and select a fixed daily slot.
- **Priority:** Must Have
- **Business Rules:**
  - BR-AF-001: First-to-finish-form wins the slot concurrency.
  - BR-AF-002: Profile completeness is required before submission.
- **Acceptance Criteria:**
  - [ ] Given I selected a date and slot, when I submit, system creates a "PENDING" request.
  - [ ] System prevents submission and shows warning if profile is incomplete.

#### FR-AF-002: Request Cancellation
- **Description:** Adopters shall be able to cancel their "PENDING" or "APPROVED" requests.
- **Priority:** Must Have
- **Business Rules:**
  - BR-AF-003: 2-hour lock-out period before the scheduled visit time.
- **Acceptance Criteria:**
  - [ ] Given I am on "My Requests", I can click "Cancel".
  - [ ] System blocks cancellation if current time is within 2 hours of slot start.

### 4.2 Adoption Request Management (Staff)
#### FR-AF-003: Request Review Dashboard
- **Description:** System shall provide a dashboard with filters (Species, Status, Adopter Name) to manage inquiries.
- **Priority:** Must Have
- **Acceptance Criteria:**
  - [ ] System displays all requests with quick actions for Approve/Reject.

#### FR-AF-004: Visit Finalization
- **Description:** Staff shall document visits and finalize adoptions.
- **Priority:** Must Have
- **Business Rules:**
  - BR-AF-004: "Visit Notes" must be filled before "Finalize Adoption" is enabled.
- **Acceptance Criteria:**
  - [ ] Given a visit is "APPROVED", I can check-in the adopter and enter visit notes.
  - [ ] System enables "Finalize Adoption" only after notes are saved.

### 4.3 Lifecycle Automation
#### FR-AF-005: Auto-Rejection & Cleanup
- **Description:** Finalizing an adoption shall update the pet's status and reject all other concurrent requests.
- **Priority:** Must Have
- **Business Rules:**
  - BR-AF-005: Auto-rejected adopters shall receive a suggestion to "View similar pets".
- **Acceptance Criteria:**
  - [ ] System automates rejection of other requests for the same animal.
  - [ ] System triggers notification to affected adopters.

---

## 5. Business Rules Catalog
| ID | Rule | Applies To | Validation |
|----|------|------------|------------|
| BR-AF-001 | Concurrency | Request Submission | If slot capacity is reached at the moment of submission, reject with "Slot no longer available" error. |
| BR-AF-002 | Guardrail | Request Submission | User must have `profile_complete: true` in their profile record. |
| BR-AF-003 | Lock-out | Cancellation | Block cancellation if `current_time > (slot_start - 2 hours)`. |
| BR-AF-004 | Documentation | Finalization | `visit_notes` field must not be empty/null. |
| BR-AF-005 | Suggestion | Auto-Rejection | Notification payload must include a link to similar pets based on species. |

---

## 6. Interface Specifications
### 6.1 User Interface Requirements
- **Visit Modal**: Step-wise flow (1. Date -> 2. Slot -> 3. Confirm).
- **Staff Dashboard**: Tabbed or filtered list for "Pending" vs "History".
- **Settings**: Simple list view for managing `VisitSlotTemplates`.

---

## 7. Traceability Matrix
| PRD / Epic Item | FSD Requirement(s) | Priority |
|-----------------|-------------------|----------|
| US-AF1 (PRD)    | FR-AF-001         | High     |
| EPIC-001        | FR-AF-001, FR-AF-002 | High     |
| EPIC-002        | FR-AF-003, FR-AF-004 | High     |
| EPIC-003        | FR-AF-005         | High     |
