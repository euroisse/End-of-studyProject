-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cout_stage" (
    "quoteId" INTEGER NOT NULL,
    "projectStageId" INTEGER NOT NULL,
    "prix" REAL NOT NULL,

    PRIMARY KEY ("quoteId", "projectStageId"),
    CONSTRAINT "cout_stage_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cout_stage_projectStageId_fkey" FOREIGN KEY ("projectStageId") REFERENCES "ProjectStage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cout_stage" ("prix", "projectStageId", "quoteId") SELECT "prix", "projectStageId", "quoteId" FROM "cout_stage";
DROP TABLE "cout_stage";
ALTER TABLE "new_cout_stage" RENAME TO "cout_stage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
