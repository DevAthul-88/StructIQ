-- CreateTable
CREATE TABLE "project_details" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "aiInputId" TEXT NOT NULL,
    "costEstimation" REAL,
    "timeline" TEXT,
    "regulatoryCompliance" TEXT,
    "riskAssessment" TEXT,
    "environmentalAnalysis" TEXT,
    "materialOptimization" TEXT,
    "buildingSimulation" TEXT,
    "siteLayout" TEXT,
    "safetyFeatures" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "project_details_aiInputId_fkey" FOREIGN KEY ("aiInputId") REFERENCES "ai_inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
