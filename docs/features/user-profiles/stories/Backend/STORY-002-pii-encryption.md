# STORY-002: PII Encryption Utility

**Epic:** EPIC-002 - Adopter User Profiles
**Role:** Backend
**Story Points:** 5
**Priority:** Must Have

---

## User Story
As a Developer,
I want to implement a secure encryption utility for sensitive adopter data,
So that Personally Identifiable Information (PII) is protected at rest.

## Description
Implementation of a central encryption module using Node.js `crypto` (AES-256-GCM). This utility will be used by the `ProfileService` to encrypt/decrypt fields like address, phone, and vet references before database persistence.

## Acceptance Criteria
```gherkin
GIVEN a plain-text PII string
WHEN I call encrypt(text)
THEN I receive a ciphertext string containing the IV and auth tag

GIVEN a ciphertext string
WHEN I call decrypt(ciphertext)
THEN I receive the original plain-text string

GIVEN the wrong encryption key or corrupted ciphertext
WHEN I attempt to decrypt
THEN the system throws an appropriate security error
```

## Business Rules
- **BR-PII-01**: PII fields must NEVER be stored in plain text.
- **BR-PII-02**: Encryption keys must be managed via environment variables (SECRET_KEY).

## Technical Notes
- Use `crypto.createCipheriv('aes-256-gcm', key, iv)`.
- Store ciphertext as `iv:authTag:encryptedData` in the database.

## Traceability
- **FSD Reference**: Section 2.1 (Scope), Section 3.2 (PII)
- **Epic**: EPIC-002

## Dependencies
- **Depends On**: None
- **Blocks**: STORY-003-profile-api
