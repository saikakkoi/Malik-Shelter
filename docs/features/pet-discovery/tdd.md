# Technical Design Document: Pet Discovery & Management
**Mode**: HEAVY
**Project**: Malik Shelter
**Version**: 1.0
**Date**: 2026-02-09
**Status**: Draft

## 1. Executive Summary
This feature introduces the core capability for adopters to search and view animal profiles, and for staff to manage the inventory.
**Key Technical Decisions**:
*   **Search**: Implemented via direct database queries (MySQL) with indexed columns for MVP. ElasticSearch is deferred.
*   **Images**: Stored in S3 (or compatible object storage), serving URLs directly. `AnimalPhoto` entity added for gallery support.
*   **Caching**: Redis caching for the public `/animals` list endpoint (TTL 5 mins) to reduce DB load.

## 2. System Architecture

### 2.1 Architecture Overview
A standard 3-tier REST architecture.
*   **Client**: Web App (Vue.js / Nuxt).
*   **API**: Node.js/Express (as per Global Standards).
*   **DB**: MySQL.

### 2.2 Component Architecture
| Component | Responsibility (Delta) | Technology | Dependencies |
| :--- | :--- | :--- | :--- |
| **PetController** | Handle HTTP requests for animals. | Node.js | Service Layer |
| **PetService** | Business logic (filtering, recommendations). | Node.js | DAL, Types |
| **ImageService** | Handle upload to Object Storage. | AWS SDK | S3 Bucket |

## 3. Data Architecture (Delta Focus)

### 3.1 Data Model (New/Modified)
*   **New Entity**: `AnimalPhoto` (Gallery).
*   **Modified Entity**: `Animal` (Enum updates).

| Entity | Attribute | Type | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `AnimalPhoto` | `is_main` | Boolean | Default false | Cover image flag. |
| `AnimalPhoto` | `sort_order` | Integer | Default 0 | Gallery order. |

### 3.2 Database Design
*   **Indexes**:
    *   `idx_animal_filters` on `Animal(species, status, gender, age_months)` for search performance.
    *   `idx_animal_traits` (Multi-Valued Index / JSON) if traits are stored as JSON.

### 3.3 Data Flow
1.  **Search**: Client -> API (Cache Check) -> DB (Index Scan) -> API (Response).
2.  **Upload**: Client -> API (Multipart) -> ImageService (Resize/Optimization) -> S3 -> DB (Insert `AnimalPhoto`).

## 4. API Design (Delta Focus)

### 4.2 Endpoint Specifications
See `docs/features/pet-discovery/api-contract.yaml` for full schema.

**GET /animals**
*   **Business Rules**:
    *   Result must include `pagination` metadata.
    *   Default `status` filter = `AVAILABLE`.

**GET /animals/{id}**
*   **Business Rules**:
    *   Includes `related_animals` (Calculated by Service: same species, +/- 2 years age).

## 5. Component Design

### 5.1 Backend Services
**PetService**
*   `findAnimals(filters)`: Builds dynamic SQL/ORM query.
*   `calculateRecommendations(animal)`: Simple heuristic matching.

**ImageService**
*   `upload(file)`: Validates mime-type, resizes to max 1920x1080, uploads to bucket.

### 5.2 Frontend Architecture
*   **SearchPage**: Holds filter state in URL (Query Params) for shareability.
*   **MasonryGrid**: Reusable component for results.
*   **PetGallery**: Client-side carousel with "lightbox" modal.

## 6. Performance & Scalability

### 6.1 Performance Requirements
| Metric | Target | Measurement Method |
| :--- | :--- | :--- |
| Search Latency | < 200ms | 95th percentile, Load Test |
| Image Load | < 1s | LCP (Largest Contentful Paint) |

### 6.3 Caching Strategy
*   **Public List**: Cache key `animals:list:{query_hash}`. Invalidate on any Staff Create/Update/Delete.

## 7. Failure Modes
*   **Image Upload Fail**: If S3 succeeds but DB fails, generic "orphaned object" cleanup job needed (Deferred). Return 500 to user.

## 8. Dependencies
*   **Object Storage**: AWS S3 or MinIO.
*   **Redis**: For response caching.
