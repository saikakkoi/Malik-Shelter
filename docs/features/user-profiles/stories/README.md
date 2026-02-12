# Epic Summary: Adopter User Profiles
**Epic ID:** EPIC-002
**Epic Title:** Adopter User Profiles
**Epic Description:** Implementation of a multi-step profile system for adopters, ensuring data completeness and PII security.

### Story Index by Role

#### Frontend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-006 | Adopter Profile Dashboard | Must Have | 3 | Not Started | [Link](./Frontend/STORY-006-profile-dashboard.md) |
| STORY-007 | Profile Wizard: Step 1 (Identity) | Must Have | 3 | Not Started | [Link](./Frontend/STORY-007-wizard-step-1.md) |
| STORY-008 | Profile Wizard: Step 2 (Housing & Photos) | Must Have | 5 | Not Started | [Link](./Frontend/STORY-008-wizard-step-2.md) |
| STORY-009 | Profile Wizard: Step 3 (Household) | Must Have | 2 | Not Started | [Link](./Frontend/STORY-009-wizard-step-3.md) |
| STORY-010 | Profile Wizard: Step 4 (Experience) | Must Have | 3 | Not Started | [Link](./Frontend/STORY-010-wizard-step-4.md) |
| STORY-011 | Profile Wizard: Step 5 (Lifestyle) | Must Have | 2 | Not Started | [Link](./Frontend/STORY-011-wizard-step-5.md) |
| STORY-012 | Gating Logic: Visit Requests | Must Have | 5 | Not Started | [Link](./Frontend/STORY-012-gating-logic.md) |

#### Backend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-001 | Database Schema Extension | Must Have | 3 | Not Started | [Link](./Backend/STORY-001-db-schema.md) |
| STORY-002 | PII Encryption Utility | Must Have | 5 | Not Started | [Link](./Backend/STORY-002-pii-encryption.md) |
| STORY-003 | Profile CRUD API | Must Have | 8 | Not Started | [Link](./Backend/STORY-003-profile-api.md) |
| STORY-004 | Photo Upload Service | Must Have | 5 | Not Started | [Link](./Backend/STORY-004-photo-upload.md) |
| STORY-005 | Staff Review API | Should Have | 3 | Not Started | [Link](./Backend/STORY-005-staff-review-api.md) |

#### Others
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-013 | Profile Integration Tests | Must Have | 5 | Not Started | [Link](./Others/STORY-013-integration-tests.md) |

### Story Dependency Map
```
STORY-001 (DB) ──► STORY-002 (Enc) ──► STORY-003 (API)
STORY-003 (API) ──► STORY-004 (Upload)
STORY-003 (API) ──► STORY-006 to 011 (FE)
STORY-004 (Upload) ──► STORY-008 (FE Photos)
STORY-012 (Gating) ──► STORY-003 (API)
```

### Total Estimates
- **Total Story Points:** 52
- **Frontend:** 23
- **Backend:** 24
- **Others:** 5
