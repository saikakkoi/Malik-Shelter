# Technical Design Document: Adoption Flow

**Mode:** HEAVY
**Project:** Malik Shelter
**Version:** 1.0
**Date:** 2026-02-12
**Author:** Solutions Architect (Antigravity)
**Status:** Draft

---

## 1. Executive Summary
The Adoption Flow feature introduces a structured, appointment-based visit system to replace the current manual coordination. It enables adopters to book visits via fixed daily slots and allows staff to manage these requests through a centralized dashboard.

Key technical decisions include using `node-cron` for automated visit slot generation from templates, implementing optimistic concurrency control for slot booking, and a synchronous lifecycle cleanup triggered when an animal is marked as adopted.

## 2. System Architecture

### 2.1 Architecture Overview
The system follows the existing Controller-Service-Repository (Prisma) pattern. 
- **AdoptionRequestService**: Manages the lifecycle of requests.
- **VisitSlotService**: Handles slot template management and generation.
- **VisitCron**: A background task runner for automated slot instantiation.

### 2.2 Component Architecture
| Component | Responsibility (Delta) | Technology | Dependencies |
|-----------|------------------------|------------|--------------|
| `AdoptionRequestController` | Endpoint handling for requests | Express | `AdoptionRequestService` |
| `VisitSlotService` | Logic for slot generation and availability | Prisma | `node-cron` |
| `SyncAutomation` | Auto-rejection logic during finalization | Internal Module | `AnimalService`, `ProfileService` |

## 3. Data Architecture (Delta Focus)

### 3.1 Data Model (New/Modified Only)

| Entity | Attribute | Type | Constraints | Description |
|--------|-----------|------|-------------|-------------|
| `VisitSlotTemplate` | `id` | UUID | PK | Template identifier |
| | `day_of_week` | Enum | NOT NULL | Monday-Sunday or ALL |
| | `start_time` | String | NOT NULL | HH:mm format |
| | `end_time` | String | NOT NULL | HH:mm format |
| | `capacity` | Int | Default: 1 | Max adopters per slot |
| `VisitSlot` | `id` | UUID | PK | Instance identifier |
| | `template_id` | UUID | FK | Source template |
| | `date` | Date | NOT NULL | Specific visit date |
| | `version` | Int | Default: 0 | **Optimistic Lock Version** |
| `AdoptionRequest` | `id` | UUID | PK | Request identifier |
| | `status` | Enum | Default: PENDING | PENDING, APPROVED, REJECTED, REJECTED_AUTO |
| | `visit_notes` | Text | Nullable | Staff notes from visit |

### 3.2 Database Design
- **Optimistic Locking**: `VisitSlot` will include a `version` field. Updates to `current_bookings` will execute a `where: { id, version }` check to prevent overbooking.
- **Indices**: New indices on `AdoptionRequest.status`, `VisitSlot.date`, and `Animal.status`.

### 3.3 Data Flow
1. **Slot Generation**: `node-cron` runs daily at midnight, checking `VisitSlotTemplate` and creating `VisitSlot` records for $T+7$ days if they don't exist.
2. **Booking Flow**: Adopter selects `VisitSlot`. Transaction creates `VisitBooking` and updates `VisitSlot.current_bookings` with version check.

## 4. API Design (Delta Focus)
Refer to [api-contract.yaml](file:///d:/Dyta/BZ/pet-adopt/docs/features/adoption-flow/api-contract.yaml) for full endpoint specifications.

## 5. Component Design (Delta Focus)

### 5.1 Backend Services (New/Modified Only)

**AdoptionRequestService**
- **finalizeAdoption(animalId, requestId)**: 
  - Starts transaction.
  - Updates `Animal.status` to 'ADOPTED'.
  - Updates associated `AdoptionRequest` to 'APPROVED'.
  - Fetches all other 'PENDING' or 'APPROVED' requests for `animalId`.
  - Batch updates them to 'REJECTED_AUTO'.
  - Triggers notification events.

**VisitSlotService**
- **generateDailySlots()**: Iterates through templates and bulk creates slots for a target date.

### 5.2 Frontend Architecture (New/Modified Only)

| Wireframe Screen | Component(s) | State Requirements | API Calls |
|------------------|--------------|-------------------|-----------|
| Visit Request Modal | `CalendarView`, `SlotPicker` | `selectedDate`, `slots` | `GET /visit-slots/available` |
| Staff Dashboard | `RequestTable`, `FilterBar` | `requests`, `filters` | `GET /adoption-requests` |
| Slot Settings | `TemplateList`, `TemplateForm` | `templates` | `GET /settings/visit-slot-templates` |

## 6. Failure Modes & Edge Cases (Delta Only)
- **Clock Drift**: Cron ensures idempotency by checking `(template_id, date)` existence before creation.
- **Simultaneous Finalization**: Synchronous transaction on Animal table ensures only one adopter is "finalized".

## 7. Technical Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Concurrency Overbooking | High | Med | Optimistic locking on `VisitSlot.version`. |
| Notification Spams | Low | Low | `last_notified_at` filter in rejection sweep. |

## 8. Dependencies & Assumptions
- **node-cron**: For background task scheduling.
- **Prisma Transactions**: Required for atomic finalization logic.
