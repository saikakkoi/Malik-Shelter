-- CreateTable
CREATE TABLE "AdopterProfile" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "occupation" TEXT,
    "residence_type" TEXT,
    "ownership_status" TEXT,
    "landlord_permit_url" TEXT,
    "outdoor_area" TEXT,
    "resident_count" INTEGER,
    "has_children" BOOLEAN DEFAULT false,
    "allergy_details" TEXT,
    "existing_pets" TEXT,
    "ownership_history" TEXT,
    "vet_references" TEXT,
    "time_pet_alone" TEXT,
    "activity_level" TEXT,
    "future_plans" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "AdopterProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdopterHomePhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adopter_id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdopterHomePhoto_adopter_id_fkey" FOREIGN KEY ("adopter_id") REFERENCES "AdopterProfile" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
