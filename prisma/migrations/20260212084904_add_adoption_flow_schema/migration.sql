-- CreateTable
CREATE TABLE "VisitSlotTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_by_id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "capacity_per_slot" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "VisitSlotTemplate_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "StaffProfile" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VisitSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "template_id" TEXT,
    "date" DATETIME NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "current_bookings" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "VisitSlot_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "VisitSlotTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdoptionRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adopter_id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "visit_notes" TEXT,
    "last_notified_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "AdoptionRequest_adopter_id_fkey" FOREIGN KEY ("adopter_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AdoptionRequest_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VisitBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visit_slot_id" TEXT NOT NULL,
    "adoption_request_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "VisitBooking_visit_slot_id_fkey" FOREIGN KEY ("visit_slot_id") REFERENCES "VisitSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VisitBooking_adoption_request_id_fkey" FOREIGN KEY ("adoption_request_id") REFERENCES "AdoptionRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "VisitSlot_date_idx" ON "VisitSlot"("date");

-- CreateIndex
CREATE INDEX "AdoptionRequest_status_idx" ON "AdoptionRequest"("status");
