# Sprint Stories: Pet Discovery & Management

## Epic: Pet Discovery & Management
**Total Estimate**: 14 Points (2 Weeks)

### Sprint 1: Foundation & Backend (7 pts)

#### Story 1: Database Migration & Models (2 pts)
**Goal**: Set up the database schema for `Animal` and `AnimalPhoto` (MySQL).
*   **Tasks**:
    *   Create migration for `Animal` (include all new enum values).
    *   Create migration for `AnimalPhoto`.
    *   Add indexes (`idx_animal_filters`).
    *   Seed initial data (Species, Breeds).

#### Story 2: Backend API - CRUD & Upload (3 pts)
**Goal**: Enable staff to manage animals via API.
*   **Tasks**:
    *   Implement `POST /animals` (Auth guarded).
    *   Implement `PUT /animals/{id}`.
    *   Implement `ImageService` (S3 Upload).
    *   Integrate image upload with `AnimalPhoto` creation.

#### Story 3: Backend API - Public Search (2 pts)
**Goal**: Enable public search with filters.
*   **Tasks**:
    *   Implement `GET /animals` with pagination and filters.
    *   Implement Redis caching for list results.
    *   Implement `GET /animals/{id}` with "Recommended" logic stub (random similar species).

---

### Sprint 2: Frontend Implementation (7 pts)

#### Story 4: Public Search Page (3 pts)
**Goal**: Adopters can browse and filter pets (Vue/Nuxt).
*   **Tasks**:
    *   Build `FilterSidebar` component.
    *   Build `MasonryGrid` and `PetCard` component.
    *   Integrate `GET /animals` API.
    *   Add Lottie loading state.

#### Story 5: Pet Detail Page (2 pts)
**Goal**: Adopters can view full profile.
*   **Tasks**:
    *   Build `PetGallery` carousel.
    *   Build `MedicalBadge` and `PersonalityTag` components.
    *   Integrate `GET /animals/{id}` API.

#### Story 6: Staff Inventory Dashboard (2 pts)
**Goal**: Staff can view and manage list.
*   **Tasks**:
    *   Build Data Table for `/staff/animals`.
    *   Integrate `DELETE/Archive` actions.
    *   (Note: Add/Edit form is part of a separate story if time permits, or simplified here).
