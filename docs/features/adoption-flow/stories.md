# Sprint Stories: Adoption Flow

## Epic: Adoption Visit & Finalization
**Total Estimate**: 16 Points (2-3 Sprints)

### Sprint 1: Data Foundation & Scheduling (8 pts)

#### Story 1: Schema Migration & Slot Templates (2 pts)
**Goal**: Set up the database for visit scheduling management.
*   **Tasks**:
    - Add `VisitSlotTemplate`, `VisitSlot`, and `VisitBooking` models to `schema.prisma`.
    - Extend `AdoptionRequest` with `APPROVED` and `REJECTED_AUTO` statuses.
    - Implement `VisitSlotService` for basic Template CRUD.
    - **FSD Ref**: Section 5, 6.1

#### Story 2: Automated Slot Generation (2 pts - Backend)
**Goal**: System automatically generates daily visit slots from templates.
*   **Tasks**:
    - Implement `node-cron` job in `index.ts`.
    - Implement `generateDailySlots` logic in `VisitSlotService` (idempotent creation for T+7 days).
    - **TDD Ref**: Section 3.3, 5.1

#### Story 3: Visit Booking with Concurrency (4 pts - Backend)
**Goal**: Adopters can safely book a visit slot without overbooking.
*   **Tasks**:
    - Implement `POST /adoption-requests` with profile completeness check (BR-AF-002).
    - Implement **Optimistic Locking** on `VisitSlot` version during booking.
    - Implement `GET /visit-slots/available` with date filters.
    - **TDD Ref**: Section 3.2, 5.1

---

### Sprint 2: Adopter & Staff Workflows (8 pts)

#### Story 4: Adopter Visit Request UI (3 pts - Frontend)
**Goal**: Adopters can browse and book slots via the pet detail page.
*   **Tasks**:
    - Build `VisitRequestModal` with calendar and slot selection.
    - Integrate availability API.
    - Add "My Visits" section to User Profile.
    - Implement cancellation logic with 2-hour lock-out (BR-AF-003).
    - **FSD Ref**: Section 4.1

#### Story 5: Staff Management Dashboard (3 pts - Frontend)
**Goal**: Staff can review, filter, and approve/reject inquiries.
*   **Tasks**:
    - Build `AdoptionRequestTable` with filters for Status/Species.
    - Implement `PATCH /adoption-requests/{id}/status`.
    - Build "Visit Check-in" view with "Visit Notes" field.
    - **FSD Ref**: Section 4.2

#### Story 6: Adoption Finalization & Auto-Cleanup (2 pts - Fullstack)
**Goal**: Finalizing an adoption automatically cleans up concurrent requests.
*   **Tasks**:
    - Implement `finalizeAdoption` transaction in Backend.
    - Update Pet status to `ADOPTED`.
    - Trigger `REJECTED_AUTO` for all other pending requests for that pet.
    - Notification payload must suggest similar pets (BR-AF-005).
    - **FSD Ref**: Section 4.3, 5
