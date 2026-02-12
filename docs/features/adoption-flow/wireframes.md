# UI Wireframes: Adoption Flow

## Executive Summary
This document defines the user interface for the adoption request process, visit scheduling, and staff management workflows. It includes an adopter-facing visit request modal, a staff dashboard for request management, and a settings interface for fixed daily slots.

## Screen Inventory
| Screen | Priority | Complexity | Key Features |
|--------|----------|------------|--------------|
| [Modal] Visit Request | High | Medium | Calendar view, slot selection, profile check |
| Staff: Adoption Requests | High | High | Filtering, status updates, link to adopter profile |
| Staff: Visit Settings | Medium | Low | Global management of fixed daily slots |
| [Update] Animal Dashboard | Medium | Low | "Finalize Adoption" action for approved visits |

---

## Screen: [Modal] Visit Request
**Purpose:** Allows adopters to book a visit for a specific animal.

┌─────────────────────────────────────────────────────────┐
│  Request Visit for: Buddy [X]                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. SELECT A DATE                                       │
│  ┌───────────────────────────────────┐                  │
│  │ <       February 2026           > │                  │
│  │ Su  Mo  Tu  We  Th  Fr  Sa        │                  │
│  │  1   2   3   4   5   6   7        │                  │
│  │  8   9  10  11  12 [13][14]       │ (Next 7 days avail)│
│  │ [15][16][17][18][19] ...          │                  │
│  └───────────────────────────────────┘                  │
│                                                          │
│  2. SELECT A TIME SLOT (Fixed)                           │
│  ( ) 10:00 AM  ( ) 02:00 PM  ( ) 04:00 PM                │
│                                                          │
│  [!] Profile Must Be Complete Before Submitting          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ [ Cancel ]                             [ Submit Request ]│
└─────────────────────────────────────────────────────────┘

---

## Screen: Staff: Adoption Requests Dashboard
**Purpose:** Central hub for reviewing and managing adoption inquiries.

┌─────────────────────────────────────────────────────────┐
│ [Logo]  Search: [____________]  Filters: [All Species ▼] │
│ [Pending ▼] [Urgent ▼] [Adopter Name ▼]                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  PENDING REQUESTS (12)                                   │
│                                                          │
│  [ Adopter ]    [ Pet ]      [ Date/Time ]    [ Action ] │
│  ┌─────────┐  ┌─────────┐   ┌────────────┐  ┌──────────┐ │
│  │ John D. │  │ Buddy   │   │ Feb 13, 10A│  │ [Appr][X]│ │
│  └─────────┘  └─────────┘   └────────────┘  └──────────┘ │
│    (View Profile)                                        │
│                                                          │
│  [ Adopter ]    [ Pet ]      [ Date/Time ]    [ Action ] │
│  ┌─────────┐  ┌─────────┐   ┌────────────┐  ┌──────────┐ │
│  │ Jane S. │  │ Luna    │   │ Feb 14, 02P│  │ [Appr][X]│ │
│  └─────────┘  └─────────┘   └────────────┘  └──────────┘ │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ [ < Prev ] [ 1 ] [ 2 ] [ Next > ]                        │
└─────────────────────────────────────────────────────────┘

---

## Screen: Staff: Visit Settings
**Purpose:** Define global fixed daily slots for scheduling.

┌─────────────────────────────────────────────────────────┐
│ [< Dashboard]  Slot Settings                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Current Active Slots:                                   │
│  - 10:00 AM [Edit] [Delete]                              │
│  - 02:00 PM [Edit] [Delete]                              │
│  - 04:00 PM [Edit] [Delete]                              │
│                                                          │
│  [ + Add New Slot ]                                      │
│                                                          │
│  [ ] Apply to all days                                   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                          [ Save Changes ]│
└─────────────────────────────────────────────────────────┘

---

## Screen: [Update] Staff: Animal Inventory
**Purpose:** Finalize adoption once a visit is complete.

┌─────────────────────────────────────────────────────────┐
│ [ Photo ]  [ Name ]  [ Status ]        [ Actions ]       │
│ ┌───────┐  ┌──────┐  ┌──────────┐    ┌─────────────────┐ │
│ │ Image │  │ Buddy│  │ Approved │    │ [Finalize Adopt]│ │
│ └───────┘  └──────┘  └──────────┘    └─────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
*Note: "Finalize Adoption" only appears when an animal has an approved visit status.*

---

## Interaction Annotations
1.  **Profile Check**: The "Submit Request" button in the modal is disabled if `user.profile_complete` is false.
2.  **Concurrency**: If a slot is booked for a specific pet on a specific day, it becomes disabled for other adopters for *that same pet*.
3.  **Auto-Rejection**: Clicking "Finalize Adoption" triggers the backend sweep that notifies all other applicants for that animal.
4.  **Filters**: Staff can filter requests by animal species (Dog/Cat), request status (Pending/Approved), and Adopter Name.

## Responsive Behavior
- **Adopter Modal**: Full-screen overlay on mobile to maximize calendar touch area.
- **Staff Dashboard**: Cards instead of tables on mobile, with quick-action swipe for approve/reject.
