/*
  Warnings:

  - You are about to drop the column `status` on the `ProjectStage` table. All the data in the column will be lost.
  - Added the required column `projectStageId` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectStage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "end_date" DATETIME,
    CONSTRAINT "ProjectStage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectStage" ("createdAt", "description", "id", "projectId", "title", "updatedAt") SELECT "createdAt", "description", "id", "projectId", "title", "updatedAt" FROM "ProjectStage";
DROP TABLE "ProjectStage";
ALTER TABLE "new_ProjectStage" RENAME TO "ProjectStage";
CREATE TABLE "new_Tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effort" INTEGER,
    "projectStageId" INTEGER NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'BASSE',
    "status" TEXT NOT NULL DEFAULT 'A_FAIRE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "end_date" DATETIME,
    CONSTRAINT "Tasks_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tasks_projectStageId_fkey" FOREIGN KEY ("projectStageId") REFERENCES "ProjectStage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tasks" ("createdAt", "description", "effort", "employeeId", "id", "priority", "projectId", "status", "title", "updatedAt") SELECT "createdAt", "description", "effort", "employeeId", "id", "priority", "projectId", "status", "title", "updatedAt" FROM "Tasks";
DROP TABLE "Tasks";
ALTER TABLE "new_Tasks" RENAME TO "Tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
