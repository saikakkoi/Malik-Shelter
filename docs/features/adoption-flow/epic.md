# Feature Epic: Adoption Flow & Visit Management

## Executive Summary
This Epic covers the transition from pet discovery to successful adoption, focusing on scheduling visits, staff review, and automated post-adoption cleanup.

- **Total EPICs/Modules**: 3
- **Complexity**: Medium
- **Key Dependencies**: Animal Management (Existing), User Profiles (Existing), Premium Notification System (Existing)

---

## Individual EPIC-001: Visit Scheduling & Request (Adopter)

### Business Value Statement
Enables prospective adopters to proactively book a visit during shelter-defined slots, reducing back-and-forth communication and accelerating the matching process.

### Description
Includes the UI components on the Pet Details page to trigger a request, a date-time picker for fixed slots, and a "My Requests" dashboard for adopters.

### Source Traceability
| Document | Reference | Section/Page |
|----------|-----------|--------------|
| PRD Addendum | US-AF1 | User Stories |
| Main PRD | US-A3 | 5.1 Adopter Stories |

### Scope Definition
| In Scope | Out of Scope |
|----------|--------------|
| "Request Visit" button on Pet Details | Dynamic scheduling/Calendar sync |
| Fixed daily slot selection (next 7 days) | Rescheduling by Adopter (MVP) |
| Adopter Dashboard (View Status) | Multiple visit types |

### High-Level Acceptance Criteria
- [ ] Adopter can view available slots for an animal.
- [ ] Adopter can select one slot and submit a request.
- [ ] Adopter can view the status of their request (Pending, Approved, Rejected).
- [ ] Adopter cannot book a slot if they have an incomplete profile.

---

## Individual EPIC-002: Adoption Request Management (Staff)

### Business Value Statement
Provides staff with a centralized workflow to vet applicants and manage the shelter's visiting schedule, ensuring quality adoptions and efficient operations.

### Description
A staff-facing dashboard that lists all pending visit requests, provides links to adopter profiles, and allows for manual approval or rejection.

### Source Traceability
| Document | Reference | Section/Page |
|----------|-----------|--------------|
| PRD Addendum | US-AF3, US-AF4 | User Stories |
| Main PRD | US-S3 | 5.2 Staff Stories |

### Scope Definition
| In Scope | Out of Scope |
|----------|--------------|
| Centralized Request Dashboard | Automated background checks |
| Approval/Rejection actions | Real-time chat with adopter |
| View linked Adopter Profile | Multiple staff assignees per request |

### High-Level Acceptance Criteria
- [ ] Staff can see a list of all "Pending" requests.
- [ ] Staff can click into a request to seepet details and adopter profile.
- [ ] Staff can approve a visit, updating status to "Approved".
- [ ] Staff can reject a visit with an optional reason.

---

## Individual EPIC-003: Adoption Finalization & Workflow Automation (System)

### Business Value Statement
Automates the "happy path" conclusion of an adoption, ensuring that the inventory is updated instantly and other applicants are transparently notified, preventing missed expectations.

### Description
Backend logic triggered when staff marks an animal as "Adopted". This includes updating the `Animal` status and auto-rejecting all remaining pending/approved requests for that animal.

### Source Traceability
| Document | Reference | Section/Page |
|----------|-----------|--------------|
| PRD Addendum | US-AF5 | User Stories |
| Main PRD | US-S4 | 5.2 Staff Stories |

### Scope Definition
| In Scope | Out of Scope |
|----------|--------------|
| Update Animal status to 'Adopted' | Logistics/Delivery tracking |
| Auto-rejection of concurrent requests | Reverting adoption (Manual only) |
| Notification triggers for rejected adopters | Post-adoption follow-up automation |

### High-Level Acceptance Criteria
- [ ] Marking a pet as "Adopted" removes it from public search.
- [ ] All other pending/approved requests for that pet are moved to "Rejected - Already Adopted".
- [ ] Affected adopters receive a premium notification or email.

---

## Complexity Assessment
- **Size**: L
- **Technical Complexity**: Medium (Concurrency handling)
- **Integration Complexity**: Medium (Notification system + Profile validation)
- **Estimated Story Count**: 8-12

---

## Risks & Assumptions
**Assumptions:**
- Adopters must have a complete profile before requesting a visit.
- Staff will manually verify documents during the visit.

**Risks:**
- Concurrency: Two staff members might try to approve different adopters for the same animal at the same time.
- Notification failures: Adopters might not be aware of auto-rejections if email/notification fails.
