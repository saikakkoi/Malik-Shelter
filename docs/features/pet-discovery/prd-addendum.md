# Feature PRD Addendum: Pet Discovery & Management

## 1. Feature Overview
**Feature Name**: Pet Discovery & Management
**Goal**: Enable adopters to find animals efficiently and allow staff to manage the digital inventory.
**Scope**:
*   Public Search & Filter Interface
*   Animal Profile Detail View
*   Staff Dashboard: Animal CRUD (Create, Read, Update, Delete)

## 2. User Stories (Refined)

### Adopter
*   **US-A1.1**: I want to filter animals by **Species**, **Breed**, **Age Range**, **Size**, **Gender**, and **Personality Traits**.
    *   *Note*: Multi-select for traits (e.g., "Good with Kids" AND "Calm").
*   **US-A1.2**: I want to sort results by "Newest" or "Oldest".
*   **US-A2.1**: On the animal profile, I want to see the **Lottie Loading Animation** while images load.
*   **US-A2.2**: I want to see "Recommended" pets at the bottom of a profile based on similar traits.

### Staff
*   **US-S1.1**: I want to upload multiple photos for an animal (Main + Gallery).
*   **US-S1.2**: I want to "Archive" an animal instead of deleting it to preserve history.

## 3. Functional Requirements

### Search Logic
*   **Filters**: AND logic for different categories (e.g., Cat AND Large). OR logic within category (e.g., Black OR White)? -> *Decision: OR within category, AND between categories.*
*   **Pagination**: 20 items per page.

### Profile View
*   **Medical Privacy**: Show "Vaccinated" (Yes/No) publicly. Hide detailed vet notes (Staff only) unless specifically required? -> *PRD says "Transparently view health data". We will show summary.*

### Staff Inputs
*   **Validation**:
    *   Name: Required, Max 50 chars.
    *   Age: Required, Numeric.
    *   Photos: Min 1, Max 5. Max 5MB each.

## 4. Edge Cases
*   **Zero Results**: Show "No pets found" with a "Reset Filters" button.
*   **Concurrent Edit**: If two staff edit the same animal, last save wins (MVP).

## 5. UI/UX Notes
*   Use **Masonry Layout** for search results if photos vary in aspect ratio.
*   Use **Sage Green** for "Available" badges.
*   Use **Terracotta** for "Adopt Me" button on the card.
