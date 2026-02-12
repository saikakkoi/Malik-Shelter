# STORY-004: Photo Upload Service

**Epic:** EPIC-002 - Adopter User Profiles  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an Adopter,  
I want to upload photos of my residence,  
So that the shelter can verify the environment.

## Description
Implementation of the file upload endpoint `POST /me/profile/photos`. This service will handle multipart form data, validate file size/type, and store images in the configured cloud storage.

## Acceptance Criteria
```gherkin
GIVEN a valid JPG/PNG file (< 5MB)
WHEN I POST to /me/profile/photos
THEN the file is stored
AND a new record is created in AdopterHomePhoto
AND I receive a 201 Created response with the photo URL

GIVEN a file larger than 5MB
WHEN I attempt to upload
THEN I receive a 400 Bad Request error with a clear message

GIVEN a non-image file
WHEN I attempt to upload
THEN I receive a 400 Bad Request error
```

## Business Rules
- **BR-1:** Max file size 5MB.
- **BR-2:** Allowed formats: JPG, PNG, WEBP.

## Technical Notes
- Use `multer` for request parsing.
- Integration with storage provider (S3/Cloudinary) or local dev storage.

## Traceability
- **FSD Reference:** FR-003
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-003-profile-api
- **Blocks:** STORY-008-wizard-step-2 (Frontend)
