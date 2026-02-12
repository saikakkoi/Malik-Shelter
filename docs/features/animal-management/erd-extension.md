# ERD Extension (Delta): Animal Management

## Overview
This document outlines the data model changes (or existing coverage) required for the Animal Management feature. Upon review, the existing Prisma schema already includes all requested fields. This document serves as a verification of that coverage.

## Existing Schema Audit
The following fields in the `Animal` model (file:///d:/Dyta/BZ/pet-adopt/prisma/schema.prisma) fully cover the requirements for the Animal Management feature:

### Profile Fields
- `name`: String
- `species`: String
- `breed`: String
- `gender`: String
- `age_months`: Int
- `weight_kg`: Float

### Background & Narrative
- `bio`: String? (Markdown/Rich text support)
- `origin`: String? (Free-text narrative)

### Medical Data
- `is_sterilized`: Boolean
- `medical_summary`: String?
- `dietary_requirements`: String?

### Personality & Behavior
- `energy_level`: String? (To be stored as numeric string "1"-"5")
- `social_compatibility`: String? (Comma-separated or JSON list of tags)
- `training_level`: String?

### Media
- **Relation**: `AnimalPhoto[]`
- `photo_url`: String
- `is_main`: Boolean
- `sort_order`: Int

## Proposed Database Validations
- **Energy Level**: Ensure API validates input is within "1" to "5" range.
- **Photos**: Max 5 photos per animal (enforced at application layer).
- **Required Fields**: `name`, `species`, `breed`, `gender`, `age_months`, `weight_kg`, `status`.

## Traceability
| Feature Requirement | Database Field | Type |
|--------------------|----------------|------|
| Animal Profile | `Animal` | Model |
| Medical Sterilization | `is_sterilized` | Boolean |
| Personality Tags | `social_compatibility`| String |
| Bio/Background | `bio`, `origin` | String |
| Photos | `AnimalPhoto` | Model |
