# UI Wireframes: Pet Discovery & Management

## 1. Information Architecture
### Sitemap (Partial)
```
/ (Home)
├── /pets (Search & List)
│   └── /pets/{id} (Pet Detail)
└── /staff (Dashboard)
    └── /staff/animals (Inventory)
        ├── /staff/animals/new (Create)
        └── /staff/animals/{id}/edit (Update)
```

---

## 2. Screen: Public Pet Search (`/pets`)

**Purpose**: allow adopters to filter and browse animals.
**User Story**: US-A1.1, US-A1.2, E1

### Layout
```
┌────────────────────────────────────────────────────────────────────────┐
│  [Logo]  [Home]  [Adopt]  [About]                    [Login/SignUp]    │
├────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  FILTERS               │  │  RESULTS (24 Animals)                │  │
│  │                        │  │  [Sort: Newest v]                    │  │
│  │  Available (Checked)   │  │                                      │  │
│  │  Species               │  │  ┌──────────────┐  ┌──────────────┐  │  │
│  │  [ ] Cat  [ ] Dog      │  │  │ [PHOTO]      │  │ [PHOTO]      │  │  │
│  │                        │  │  │              │  │              │  │  │
│  │  Personality           │  │  │ [Badges]     │  │              │  │  │
│  │  [ ] Good w/ Kids      │  │  │ Name, Age    │  │ Name, Age    │  │  │
│  │  [ ] Calm              │  │  │ Breed        │  │ Breed        │  │  │
│  │                        │  │  │              │  │              │  │  │
│  │  [Reset Filters]       │  │  │ (Details >)  │  │ (Details >)  │  │  │
│  │                        │  │  └──────────────┘  └──────────────┘  │  │
│  │                        │  │                                      │  │
│  └────────────────────────┘  │  [Pagination: < 1 2 3 > ]            │  │
│                              └──────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Specs
*   **Filter Sidebar**: Accordion style. Updates results via AJAX (Debounced).
*   **Pet Card**:
    *   **Image**: Aspect Fill (`object-fit: cover`).
    *   **Badges**: `personality_trait` tags (e.g., "Calm" in Soft Rose).
    *   **Status**: If not available, show overlay "Adopted".
*   **Loading State**: Display **Lottie Cat Animation** centered.

---

## 3. Screen: Pet Detail (`/pets/{id}`)

**Purpose**: Show full details to convince user to adopt.
**User Story**: US-A2.1, US-A2.2, E2

### Layout
```
┌────────────────────────────────────────────────────────────────────────┐
│  [< Back to Search]                                                    │
├────────────────────────────────────────────────────────────┬───────────┤
│                                                            │           │
│  [ MAIN PHOTO GALLERY CAROUSEL ]                           │ [CARD]    │
│  (Main image + thumbnails below)                           │           │
│                                                            │ Name      │
│  ┌──────────────────────────────────────────────────────┐  │ Breed     │
│  │  About {Name}                                        │  │ Age/Sex   │
│  │  {Bio Text}                                          │  │           │
│  └──────────────────────────────────────────────────────┘  │ [Status]  │
│                                                            │           │
│  ┌──────────────────────┐  ┌─────────────────────────┐     │ [ADOPT]   │
│  │  Personality         │  │  Medical Summary        │     │ (Button)  │
│  │  - Energy: High      │  │  - Vaccinated: Yes      │     │           │
│  │  - Social: High      │  │  - Sterilized: Yes      │     │           │
│  └──────────────────────┘  └─────────────────────────┘     │           │
│                                                            │           │
│  ┌──────────────────────────────────────────────────────┐  │           │
│  │  My Story (Origin)                                   │  │           │
│  │  Found in...                                         │  │           │
│  └──────────────────────────────────────────────────────┘  └───────────┘
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  Recommended for You                                                   │
│  [Pet Card] [Pet Card] [Pet Card]                                      │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Specs
*   **Adopt Button (Terracotta)**: Triggers "Request Visit" Modal.
*   **Medical Panel**: Shows `is_sterilized`, `vaccination_status` (derived from records).
*   **Gallery**: Supports 1-5 images.

---

## 4. Screen: Staff - Animal Inventory (`/staff/animals`)

**Purpose**: CRUD operations for animals.
**User Story**: US-S1.1, US-S1.2, E3

### Layout
```
┌────────────────────────────────────────────────────────────────────────┐
│  [Dash] [Animals] [Adoptions] [Visits]                   [Staff Name]  │
├────────────────────────────────────────────────────────────────────────┤
│  Inventory                                                             │
│  [+ Add New Animal]                                                    │
│                                                                        │
│  [ Search by Name... ] [Status Filter v]                               │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Image | Name  | Breed | Status    | Requests | Actions           │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ [img] | Luna  | Cat   | AVAILABLE | 0        | [Edit] [Archive]  │  │
│  │ [img] | Max   | Dog   | PENDING   | 2        | [Edit] [Archive]  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Screen: Staff - Add/Edit Animal (`/staff/animals/new`)

**Purpose**: Input complex animal data.
**User Story**: US-S1.1, E3

### Layout
```
┌────────────────────────────────────────────────────────────────────────┐
│  < Back to Inventory                                                   │
├────────────────────────────────────────────────────────────────────────┤
│  Add New Animal                                                        │
│                                                                        │
│  1. Basic Info               2. Media               3. Medical/Traits  │
│  [Name Input]                                                          │
│  [Species Select]                                                      │
│  [Breed Input]                                                         │
│  [Gender Radio]                                                        │
│  [Age Input] [Weight Input]                                            │
│  [Origin Textarea]                                                     │
│                                                                        │
│  --------------------------------------------------------------------  │
│  Photos (Max 5)                                                        │
│  [ DRAG & DROP AREA ]                                                  │
│                                                                        │
│  --------------------------------------------------------------------  │
│  Medical & Personality                                                 │
│  [x] Sterilized                                                        │
│  [Dietary Req Input]                                                   │
│                                                                        │
│  Personality Tags (Multi-select)                                       │
│  [Good w/ Kids] [Calm] [+ Add Tag]                                     │
│                                                                        │
│  [Cancel]                                                [Save Animal] │
└────────────────────────────────────────────────────────────────────────┘
```
