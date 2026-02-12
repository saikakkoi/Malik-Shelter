# Feature Epic: Pet Discovery & Management

**Status**: Planned
**Owner**: Product Team
**Feature Lead**: TBD

## Epic Overview
This epic covers the core value proposition of Malik Shelter: allowing adopters to find their perfect match and enabling staff to manage the animal inventory.

## Breakdown

### E1: Public Pet Discovery (Search & List)
**Goal**: Users can filter and browse the verified animal database.
*   **Story 1.1**: Implement Search Interface with Filters (Species, Breed, Traits).
*   **Story 1.2**: Implement "No Results" and "Reset Filters" states.
*   **Story 1.3**: Implement Grid/Masonry Layout for results card.
*   **Story 1.4**: Integrate Lottie Animation for loading states.

### E2: Pet Profile Experience
**Goal**: Users can view detailed information to make an informed decision.
*   **Story 2.1**: Animal Header (Name, Badge, Photos).
*   **Story 2.2**: Medical & Personality Breakdown sections.
*   **Story 2.3**: "Recommended Pets" algorithm (Basic tag matching).
*   **Story 2.4**: "Adopt Me" CTA placement and state logic.

### E3: Staff Inventory Management
**Goal**: Staff can keep the database up-to-date.
*   **Story 3.1**: "Add Animal" Multi-step Form (Profile -> Medical -> Personality).
*   **Story 3.2**: Photo Upload with drag-and-drop & preview.
*   **Story 3.3**: Edit/Archive Animal workflows.
*   **Story 3.4**: Dashboard list view of all animals with status indicators.

## Dependencies
*   **Design System**: Button, Card, Badge components required.
*   **Backend**: `GET /animals` (public), `POST /animals` (staff guarded).
*   **Assets**: Default placeholder image for pets without photos.
