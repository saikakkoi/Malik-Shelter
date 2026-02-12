# EPIC: Adopter User Profiles

## Business Value Statement
The Adopter User Profiles feature empowers potential adopters to create a comprehensive digital "resumé" of their living situation, household, and pet experience. This enables Malik Shelter staff to make informed, data-driven decisions on adoption applications, improving the success rate of animal placements and reducing administrative overhead by automating profile completeness checks.

## Description
This epic covers the end-to-end implementation of the adopter profile system. It includes a multi-step "Wizard" for users to input their data, a backend service to store and validate this information (ensuring encryption of PII), and an administrative view for staff to review these profiles during the adoption process. The system will prevent adopters from requesting visits until their profile meets the "100% Complete" threshold.

## Source Traceability
| Document | Reference | Section/Page |
|----------|-----------|--------------|
| PRD Addendum | US-P1 | Adopter identity and housing details |
| PRD Addendum | US-P2 | Pet ownership history and references |
| PRD Addendum | US-P3 | Profile completeness validation |
| PRD Addendum | US-S5 | Staff review of adopter profiles |
| Main PRD | MVP Section | User Profiles (In-Scope) |

## Scope Definition
| In Scope | Out of Scope |
|----------|--------------|
| Multi-step Profile Wizard (Identity, Housing, Household, Experience, Lifestyle) | Third-party background check integrations |
| File upload for residence environment photos | Real-time chat for profile clarifications |
| Backend CRUD for Adopter profiles with PII encryption | Automated social media reference scraping |
| Mandatory field validation engine (Client & Server) | Automated "Score" for adopters (Manual review only) |
| Staff-facing "Adopter Detail" view | |

## High-Level Acceptance Criteria
- [ ] Adopters can create and update their multi-step profile including photo uploads.
- [ ] Profile data is saved as a "Draft" until all mandatory fields are filled.
- [ ] System prevents "Request Visit" actions if the profile status is not "Complete".
- [ ] Staff can access and view the full details of an adopter's profile from the dashboard.
- [ ] All PII (Personal Identifiable Information) is encrypted at rest in the database.
- [ ] The Profile Wizard provides a clear progress indicator across the 5 steps.

## Dependencies
- **Prerequisite EPICs:** User Authentication (Completed)
- **External Dependencies:** Secure file storage for residence photos (S3/Cloudinary).
- **Technical Prerequisites:** ERD Extension for Adopter Profile schema & Encryption utility.

## Complexity Assessment
- **Size:** L
- **Technical Complexity:** High (due to PII security and multi-step validation)
- **Integration Complexity:** Medium
- **Estimated Story Count:** 10-15

## Risks & Assumptions
**Assumptions:**
- Adopters are willing to provide detailed personal information for a better matching experience.
- The existing authentication system identifies "Adopter" vs "Staff" roles correctly.

**Risks:**
- High friction in profile creation might lead to user drop-off (mitigated by "Save as Draft" functionality).
- Handling residence photos may require significant storage and security considerations.

## Related EPICs
- **Blocks:** Visit Scheduling & Adoption Flow (US-A3)
- **Related:** Pet Discovery & Search (US-A1, US-A2)
