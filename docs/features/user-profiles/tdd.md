# Technical Design Document: Adopter User Profiles

**Mode:** HEAVY
**Project:** Malik Shelter
**Version:** 1.0
**Date:** 2026-02-11
**Author:** Solutions Architect
**Status:** Draft

---

## 1. Executive Summary
This document specifies the technical implementation for the Adopter User Profiles feature. The primary focus is on introducing a comprehensive profile system for adopters, ensuring data completeness before adoption visit requests, and maintaining high security for Personally Identifiable Information (PII).

Key decisions:
- **Prisma Schema**: Introducing `AdopterProfile` and `AdopterHomePhoto` entities.
- **PII Security**: Sensitive fields (Address, Phone, Vet References) will be encrypted at rest using a dedicated encryption utility.
- **Frontend**: Implementing a 5-step interactive wizard using Vue components with centralized state management for draft persistence.
- **Gating Logic**: A server-side and client-side check to enforce "Profile Completion" before enabling visit scheduling.

---

## 2. System Architecture

### 2.1 Architecture Overview
The feature follows the existing Monolith architecture:
- **Frontend**: Vue 3 (Composition API) + Tailwind CSS.
- **Backend**: Express.js + Node.js.
- **Database**: SQLite (managed via Prisma).
- **Storage**: Cloud-based object storage for environment photos (referenced by URL).

### 2.2 Component Architecture
| Component | Responsibility (Delta) | Technology | Dependencies |
|-----------|------------------------|------------|--------------|
| ProfileService | Backend logic for CRUD, validation, and PII encryption. | Node.js | Prisma, EncryptionUtil |
| ProfileWizard | UI Flow for step-by-step data collection. | Vue 3 | API Client |
| MediaService | Handling multipart uploads for home photos. | Node.js | Multer, Storage SDK |
| ValidationHook | Frontend hook for completeness and gating logic. | Vue 3 | Profile Store |

---

## 3. Data Architecture (Delta Focus)

### 3.1 Data Model (New Only)

| Entity | Attribute | Type | Constraints | Description |
|--------|-----------|------|-------------|-------------|
| AdopterProfile | `user_id` | String | PK, FK (User.id) | One-to-one link to User account |
| AdopterProfile | `residence_type`| Enum | NOT NULL | House, Apartment, etc. |
| AdopterProfile | `status` | String | DEFAULT 'DRAFT' | DRAFT or COMPLETED |
| AdopterHomePhoto| `adopter_id` | String | FK (AdopterProfile) | Parent profile reference |
| AdopterHomePhoto| `photo_url` | String | NOT NULL | Cloud storage path |

### 3.2 Database Design
- **Indexing**: A new index on `AdopterProfile.status` to optimize staff filtering.
- **Prisma Schema Delta**:
  ```prisma
  model AdopterProfile {
    user_id        String   @id
    user           User     @relation(fields: [user_id], references: [id])
    full_name      String
    phone         String   // Encrypted
    address       String   // Encrypted
    // ... other fields
    home_photos    AdopterHomePhoto[]
  }
  ```

---

## 4. API Design (Delta Focus)
Refer to [API Contract (Versioned)](file:///d:/Dyta/BZ/pet-adopt/docs/features/user-profiles/api-contract.yaml) for full endpoint specifications.

### 4.1 Security Note
All `/me/profile` endpoints require `Role: ADOPTER`.
The `/adopters/:id` endpoint requires `Role: STAFF` or `ADMIN`.

---

## 5. Component Design (Delta Focus)

### 5.1 Backend Services

**EncryptionUtility**
- **Responsibility**: Symmetric encryption/decryption for PII fields.
- **Key Class/Function**: `encrypt(text)`, `decrypt(text)` using AES-256-GCM.

**ProfileService**
- **Responsibility**: Orchestrating profile updates and completeness calculation.
- **Logic Flow**:
  1. Receive `PATCH /me/profile` request.
  2. Encrypt sensitive fields if provided.
  3. Upsert data into `AdopterProfile`.
  4. Recalculate `is_complete` based on mandatory field count and photo count (>= 2).
  5. Update `status` to 'COMPLETED' if criteria met.

### 5.2 Frontend Architecture

| Wireframe Screen | Component(s) | State Requirements | API Calls |
|------------------|--------------|-------------------|-----------|
| Profile Dashboard | `AdopterDashboard.vue` | `completionPercentage`, `status` | `GET /me/profile` |
| Step 2: Housing | `HousingStep.vue` | `residenceType`, `photosList` | `PATCH /me/profile`, `POST /me/profile/photos` |
| Profile Wizard | `ProfileWizard.vue` | `currentStep`, `formDraft` | `PATCH /me/profile` (on Next) |

---

## 7. Failure Modes & Edge Cases (Delta Only)
- **Photo Upload Fail**: If the storage service is down, UI must show a retry button without losing form data.
- **Encryption Key Rotation**: (Future consideration) Strategy for re-encrypting data if keys change.
- **Concurrent Updates**: Prisma's default isolation handles simultaneous profile edits from different devices.

---

## 8. Technical Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| PII Breach | Critical | Low | Encryption at rest + strict RBAC. |
| User Drop-off | High | Medium | Persistent draft saving after every field edit/step change. |
| Large Photo Assets| Medium | High | Client-side compression before upload + server-side limits (5MB). |

---

## 9. Dependencies & Assumptions

### 9.1 Technical Dependencies
- **Crypto Library**: Standard Node.js `crypto` or `iron-webcrypto`.
- **Validation**: `Zod` for schema validation.

---

## 10. Reference Documents
- [FSD](file:///d:/Dyta/BZ/pet-adopt/docs/features/user-profiles/fsd.md)
- [ERD Extension](file:///d:/Dyta/BZ/pet-adopt/docs/features/user-profiles/erd-extension.md)
- [API Contract](file:///d:/Dyta/BZ/pet-adopt/docs/features/user-profiles/api-contract.yaml)
- [Wireframes](file:///d:/Dyta/BZ/pet-adopt/docs/features/user-profiles/wireframes.md)
