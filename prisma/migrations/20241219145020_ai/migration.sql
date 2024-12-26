-- CreateTable
CREATE TABLE "ai_inputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "architecturalStyle" TEXT,
    "budget" REAL,
    "clientName" TEXT,
    "projectType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "costEstimation" REAL,
    "timeline" TEXT,
    "regulatoryCompliance" TEXT,
    "riskAssessment" TEXT,
    "environmentalAnalysis" TEXT,
    "materialOptimization" TEXT,
    "buildingSimulation" TEXT,
    "siteLayout" TEXT,
    "safetyFeatures" TEXT,
    CONSTRAINT "ai_inputs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "managed_projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dimension_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "length" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL,
    "units" TEXT NOT NULL,
    "aiInputId" TEXT NOT NULL,
    CONSTRAINT "dimension_data_aiInputId_fkey" FOREIGN KEY ("aiInputId") REFERENCES "ai_inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "layout_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "aiInputId" TEXT NOT NULL,
    CONSTRAINT "layout_data_aiInputId_fkey" FOREIGN KEY ("aiInputId") REFERENCES "ai_inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "material_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "properties" TEXT,
    "aiInputId" TEXT NOT NULL,
    CONSTRAINT "material_data_aiInputId_fkey" FOREIGN KEY ("aiInputId") REFERENCES "ai_inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "structural_feature_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER,
    "aiInputId" TEXT NOT NULL,
    CONSTRAINT "structural_feature_data_aiInputId_fkey" FOREIGN KEY ("aiInputId") REFERENCES "ai_inputs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
