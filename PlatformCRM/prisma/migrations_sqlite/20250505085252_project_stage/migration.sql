-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectStage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'A_VENIR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectStage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectStage" ("createdAt", "description", "id", "projectId", "status", "title", "updatedAt") SELECT "createdAt", "description", "id", "projectId", "status", "title", "updatedAt" FROM "ProjectStage";
DROP TABLE "ProjectStage";
ALTER TABLE "new_ProjectStage" RENAME TO "ProjectStage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
