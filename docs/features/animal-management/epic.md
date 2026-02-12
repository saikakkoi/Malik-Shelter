# EPIC: Animal Management System

## Business Value Statement
The Animal Management System provides shelter staff with a centralized, digital dashboard to capture comprehensive animal data, including health, behavior, and history. This ensures data-driven matching for adopters and streamlines shelter operations by replacing manual, fragmented records with a single source of truth.

## Description
This epic focuses on extending the existing Pet Inventory dashboard to support comprehensive animal lifecycle management. It includes implementing the "Add Animal" and "Edit Animal" user interfaces, integrating with the existing backend APIs (which already support these fields), and ensuring multi-photo upload capabilities.

## Source Traceability
| Document | Reference | Section/Page |
|----------|-----------|--------------|
| PRD Addendum | US-SAM1 | Animal basic profile input |
| PRD Addendum | US-SAM2 | Medical details record |
| PRD Addendum | US-SAM3 | Personality traits specification |
| Main PRD | MVP Section | Animal Management (In-Scope) |

## Scope Definition
| In Scope | Out of Scope |
|----------|--------------|
| Profile data entry (Name, Type, Breed, Gender, Age, Weight) | Automated health monitoring (vitals/sensors) |
| Multi-photo gallery support for each animal | Batch data import from external CSVs/spreadsheets |
| Background & Origin narrative tracking | Integration with 3rd-party vet clinic software |
| Medical/Sterilization status & Dietary needs | AI-driven personality classification |
| Personality/Energy/Social compatibility tagging | |

## High-Level Acceptance Criteria
- [ ] Staff can create, read, update, and delete (CRUD) animal profiles.
- [ ] Mandatory fields (Name, Type, Status) are validated before saving.
- [ ] Photos are stored securely (max 5MB each) and associated with the correct animal record.
- [ ] Origin field accepts free-text input for detailed narrative.
- [ ] Personality and Medical flags are filterable in the discovery search (future dependency).
- [ ] Changes to an animal's status (e.g., "Available" to "Adopted") are tracked in history.

## Dependencies
- **Prerequisite EPICs:** Staff Authentication (Completed)
- **External Dependencies:** Cloud storage for animal photos (e.g., S3, Cloudinary).
- **Technical Prerequisites:** ERD Extension for Animal schema.

## Complexity Assessment
- **Size:** L
- **Technical Complexity:** Medium
- **Integration Complexity:** Low
- **Estimated Story Count:** 8-12

## Risks & Assumptions
**Assumptions:**
- Staff will use a web-based dashboard for data entry.
- File storage for photos will be available and performant.

**Risks:**
- Photos larger than 5MB will be rejected by the validation layer.
- Complexity of "Social Compatibility" rules might grow beyond initial scope.

## Related EPICs
- **Blocks:** Pet Discovery & Search (US-A1, US-A2)
- **Related:** Visit Scheduling & Adoption Flow
