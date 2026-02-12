-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age_months" INTEGER NOT NULL,
    "weight_kg" REAL NOT NULL,
    "bio" TEXT,
    "origin" TEXT,
    "is_sterilized" BOOLEAN NOT NULL,
    "medical_summary" TEXT,
    "dietary_requirements" TEXT,
    "energy_level" TEXT,
    "social_compatibility" TEXT,
    "training_level" TEXT,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AnimalPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animal_id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnimalPhoto_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Animal_species_status_gender_age_months_idx" ON "Animal"("species", "status", "gender", "age_months");
