# Core Entity Relationship Diagram (ERD): Malik Shelter

```mermaid
erDiagram
    %% Core User & Auth
    User {
        uuid id PK
        string email UK
        string password_hash
        enum role "ADMIN, STAFF, ADOPTER"
        timestamp created_at
    }

    %% Profiles
    AdopterProfile {
        uuid user_id PK, FK
        string full_name
        string photo_url
        string phone
        string address
        string occupation
        
        %% Housing
        string residence_type
        string ownership_permit_status
        text outdoor_area_details
        
        %% Household
        int resident_count
        boolean has_children
        text allergy_details
        text existing_pets_details
        
        %% Experience
        text ownership_history
        text vet_references
        
        %% Lifestyle
        string time_alone_per_day
        string activity_level
        text future_plans
    }

    AdopterHomePhoto {
        uuid id PK
        uuid adopter_id FK
        string photo_url
        string description
    }

    StaffProfile {
        uuid user_id PK, FK
        string full_name
        string department
    }

    %% Animal Management
    Animal {
        uuid id PK
        string name
        string species "Cat, Dog"
        string breed
        string gender " Male, Female"
        int age_months
        float weight_kg
        string photo_url
        
        %% Background
        text bio
        string origin
        
        %% Medical Summary
        boolean is_sterilized
        text special_medical_conditions
        text dietary_requirements
        
        %% Personality Dimensions
        string energy_level
        string social_compatibility
        string training_level
        
        enum status "AVAILABLE, PENDING, ADOPTED, NOT_READY"
        timestamp created_at
    }

    MedicalRecord {
        uuid id PK
        uuid animal_id FK
        enum type "VACCINATION, SURGERY, CHECKUP, CONDITION"
        date record_date
        string description
        string vet_name
    }

    %% Adoption Flow
    VisitSlot {
        uuid id PK
        uuid created_by_staff_id FK
        datetime start_time
        datetime end_time
        int capacity
        int current_bookings
    }

    AdoptionRequest {
        uuid id PK
        uuid adopter_id FK
        uuid animal_id FK
        enum status "PENDING_VISIT, VISIT_SCHEDULED, VISIT_COMPLETED, APPROVED, REJECTED"
        timestamp created_at
    }

    VisitBooking {
        uuid id PK
        uuid visit_slot_id FK
        uuid adoption_request_id FK
        enum status "SCHEDULED, COMPLETED, CANCELLED, NO_SHOW"
    }

    %% Relationships
    User ||--|| AdopterProfile : "has"
    User ||--|| StaffProfile : "has"
    AdopterProfile ||--o{ AdopterHomePhoto : "uploads"
    
    Animal ||--o{ MedicalRecord : "has history"
    Animal ||--o{ AdoptionRequest : "receives"

    User ||--o{ AdoptionRequest : "makes"
    User ||--o{ VisitBooking : "attends"
    
    StaffProfile ||--o{ VisitSlot : "manages"
    VisitSlot ||--o{ VisitBooking : "contains"
    AdoptionRequest ||--o{ VisitBooking : "schedule"
```

## Entity Dictionary

### 1. User & Profiles
*   **User**: Central authentication entity.
*   **AdopterProfile**: Expanded to include all PRD requirements:
    *   *Identity*: Occupation, Contact.
    *   *Housing*: Permit status, Outdoor details.
    *   *Home Photos*: Stored in `AdopterHomePhoto`.
    *   *Lifestyle/Experience*: Vet refs, history, future plans.

### 2. Animal Inventory
*   **Animal**: Includes detailed adoption criteria:
    *   *Background*: Origin.
    *   *Medical*: Sterilization, Diet, Conditions.
    *   *Personality*: Explicit fields for Energy, Social, Training.
*   **MedicalRecord**: Log of deep history (vaccines, surgeries).

### 3. Operations
*   **VisitSlot/Booking**: Manages the "Appointment-only" workflow.
