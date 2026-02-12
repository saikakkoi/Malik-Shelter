# Sprint Stories: Adopter User Profiles

This document provides a consolidated list of implementable stories for the Adopter User Profiles feature. For detailed acceptance criteria and technical notes, refer to the individual files in the `stories/` directory.

## Backend Stories
| ID | Title | Points | Description |
|----|-------|--------|-------------|
| [STORY-001](./stories/Backend/STORY-001-db-schema.md) | Database Schema Extension | 3 | Implementation of Prisma models. |
| [STORY-002](./stories/Backend/STORY-002-pii-encryption.md) | PII Encryption Utility | 5 | AES-256-GCM module for sensitive fields. |
| [STORY-003](./stories/Backend/STORY-003-profile-api.md) | Profile CRUD API | 8 | Core GET/PATCH endpoints for profiles. |
| [STORY-004](./stories/Backend/STORY-004-photo-upload.md) | Photo Upload Service | 5 | Multipart upload logic for home photos. |
| [STORY-005](./stories/Backend/STORY-005-staff-review-api.md) | Staff Review API | 3 | Admin endpoint for adopter review. |

## Frontend Stories
| ID | Title | Points | Description |
|----|-------|--------|-------------|
| [STORY-006](./stories/Frontend/STORY-006-profile-dashboard.md) | Adopter Profile Dashboard | 3 | User landing page for profile management. |
| [STORY-007](./stories/Frontend/STORY-007-wizard-step-1.md) | Wizard Step 1: Identity | 3 | Basic identity and contact fields. |
| [STORY-008](./stories/Frontend/STORY-008-wizard-step-2.md) | Wizard Step 2: Housing | 5 | Residence info and photo uploader. |
| [STORY-009](./stories/Frontend/STORY-009-wizard-step-3.md) | Wizard Step 3: Household | 2 | Residents and existing pets. |
| [STORY-010](./stories/Frontend/STORY-010-wizard-step-4.md) | Wizard Step 4: Experience| 3 | Previous ownership and vet refs. |
| [STORY-011](./stories/Frontend/STORY-011-wizard-step-5.md) | Wizard Step 5: Lifestyle | 2 | Activity level and future plans. |
| [STORY-012](./stories/Frontend/STORY-012-gating-logic.md) | Gating Logic: Visit Requests | 5 | Disabling actions for incomplete profiles. |

## Others
| ID | Title | Points | Description |
|----|-------|--------|-------------|
| [STORY-013](./stories/Others/STORY-013-integration-tests.md) | Profile Integration Tests | 5 | Validation of end-to-end profile flows. |

---
**Total Story Points: 52**
