# Product Requirements Document (PRD): Malik Shelter
## Overview

| Metadata | Details |
| :--- | :--- |
| **Product Name** | Malik Shelter |
| **Version** | 1.0 (Draft) |
| **Status** | In Review |
| **Document Owner** | Product Manager |
| **Target Release** | Q4 2026 |

---

## 1. Background & Problem Statement

### Context
Malik Shelter is a breeding entity transitioning to provide modern adoption services. The current adoption process is manual, lacks transparency regarding animal health/behavior, and suffers from scheduling inefficiencies.

### Problem Statement
Prospective adopters struggle to find pets that match their specific lifestyle criteria due to incomplete data. Simultaneously, staff are burdened by manual scheduling and data entry, leading to slower adoption cycles and potential mismatches.

### Goals
1.  **Digitize Inventory**: Create a complete digital record of all animals.
2.  **Improve Matching**: Use data (personality, medical) to ensure better adopter-pet fit.
3.  **Streamline Operations**: Automate scheduling and status updates to reduce staff workload.

---

## 2. Objectives

### Business Objectives
*   Increase successful adoption rate by 20% in the first year.
*   Reduce time-to-adopt from initial inquiry to finalization by 30%.
*   Maintain 100% data completeness for all adoptable animals.

### User Objectives
*   **Adopters**: Easily find specific pets, transparently view health/behavior data, and schedule visits without back-and-forth calls.
*   **Staff**: Efficiently manage animal inventory and adoption workflows from a single dashboard.

---

## 3. Scope (MVP)

### In-Scope (MVP) ✅
*   **Animal Management**: Staff input for:
    *   **Profile**: Name, Type, Breed, Gender, Age, Weight, Photo.
    *   **Background**: Bio/Description, Origin.
    *   **Medical**: Sterilization status, Special conditions, Dietary requirements.
    *   **Personality**: Energy level, Social compatibility, Training level.
*   **Search & Discovery**: Adopter search with filters (Species, Breed, Age, Size, Gender, Personality).
*   **Adoption Flow**: "Select" animal -> Request Visit -> Staff Approval/Rejection.
*   **Scheduling**: Staff-managed visit slots; Adopters book available slots.
*   **Rules Engine**: Auto-rejection of concurrent applicants once an animal is adopted.
*   **Location Services**: OpenStreetMap (OSM) integration for shelter direction.
*   **User Profiles**: Adopter profile creation with:
    *   **Identity**: Name, Photo, Contact, Address, Occupation.
    *   **Housing**: Residence type, Ownership permit, Outdoor area details, Environment photos.
    *   **Household**: Resident count, Children presence, Allergies, Existing pets.
    *   **Experience**: Ownership history, Vet references.
    *   **Lifestyle**: Time alone/day, Activity level, Future plans.
    *   *Validation*: Completeness check required before requesting visits.

### Out-of-Scope ❌
*   Online payments (Free service).
*   Home delivery logistics.
*   In-app messaging (Email/Phone notifications only).
*   AI-based matching algorithms (Roadmap).

---

## 4. User Roles & Flow

### Roles
1.  **Adopter**: Public user seeking a companion.
2.  **Staff**: Internal user managing operations.

### High-Level User Flow (Happy Path)
1.  **Adopter** browses/filters pets.
2.  **Adopter** views Pet Profile (Medical + Personality).
3.  **Adopter** selects pet and requests a Visit Date from available slots.
4.  **Staff** reviews request + Adopter Profile.
5.  **Staff** approves visit.
6.  **Adopter** visits shelter (guided by OSM).
7.  **Staff** finalizes adoption -> Animal Status updates to "Adopted".
8.  **System** auto-rejects other pending requests for that animal.

---

## 5. Functional Requirements & User Stories

### 5.1 Adopter Stories

| ID | User Story | Acceptance Criteria | Priority |
| :--- | :--- | :--- | :--- |
| **US-A1** | As an Adopter, I want to search for pets with specific criteria (species, personality, etc.) | **Given** I am on the search page<br>**When** I select filters (e.g., "Good with kids")<br>**Then** only matching animals are shown | High |
| **US-A2** | As an Adopter, I want to see a pet's full medical and personality profile | **Given** I view a pet card<br>**When** I click details<br>**Then** I see vaccination status, known issues, and behavioral tags | High |
| **US-A3** | As an Adopter, I want to request a visit date | **Given** I selected a pet<br>**When** I choose a date/time from available slots<br>**Then** a request is sent to staff | High |
| **US-A4** | As an Adopter, I want to see the shelter location on a map | **Given** I have a scheduled visit<br>**When** I view details<br>**Then** an OSM map shows the shelter location | Medium |

### 5.2 Staff Stories

| ID | User Story | Acceptance Criteria | Priority |
| :--- | :--- | :--- | :--- |
| **US-S1** | As Staff, I want to input detailed animal data | **Given** I am adding a new animal<br>**When** I save<br>**Then** the system validates that all mandatory fields (ID, medical, personality) are filled | High |
| **US-S2** | As Staff, I want to manage visit schedules | **Given** I am on the dashboard<br>**When** I create visit slots<br>**Then** these slots become visible to adopters | High |
| **US-S3** | As Staff, I want to approve or reject adoption requests | **Given** a pending request<br>**When** I approve<br>**Then** the adopter is notified | High |
| **US-S4** | As Staff, I want to mark an animal as "Adopted" | **Given** an adoption is finalized<br>**When** I update status to "Adopted"<br>**Then** the animal is removed from public search<br>**And** other pending requests for this animal are auto-rejected | High |

---

## 6. Success Metrics

| Metric | Goal | Measurement |
| :--- | :--- | :--- |
| **Profile Completeness** | 100% | % of active animal profiles with all mandatory fields filled. |
| **Visit Show Rate** | >85% | % of scheduled visits that occur. |
| **Adoption Velocity** | <14 Days | Average days from "Listed" to "Adopted". |

---

## 7. Technical Constraints & Dependencies

*   **Mapping**: Must use OpenStreetMap (OSM) API (No Google Maps).
*   **Performance**: Search results must load in < 2 seconds.
*   **Security**: Adopter data (PII) must be encrypted at rest.
*   **Accessibility**: WCAG 2.1 AA compliance desirable.

## 8. Open Questions

| ID | Question | Owner | Status |
| :--- | :--- | :--- | :--- |
| Q1 | Do we need email notifications or SMS? | Product | Open |
| Q2 | What is the retention policy for adopted animal data? | Legal/Product | Open |

---

## 9. Appendix
*   **Glossary**:
    *   *Breeder Entity*: The organization managing the animals (Malik Shelter).
    *   *OSM*: OpenStreetMap.
