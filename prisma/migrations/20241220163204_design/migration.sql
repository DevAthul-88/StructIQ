-- CreateTable
CREATE TABLE "StructuralSystem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "foundationType" TEXT NOT NULL,
    "foundationDepth" REAL NOT NULL,
    "soilCapacity" REAL,
    "primarySpacingX" REAL NOT NULL,
    "primarySpacingY" REAL NOT NULL,
    "secondarySpacingX" REAL,
    "secondarySpacingY" REAL,
    CONSTRAINT "StructuralSystem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "managed_projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "length" REAL NOT NULL,
    "height" REAL NOT NULL,
    "area" REAL NOT NULL,
    "floorFinish" TEXT,
    "wallFinish" TEXT,
    "ceilingFinish" TEXT,
    "fireRating" TEXT,
    "occupancyLoad" INTEGER,
    "ventilation" TEXT,
    CONSTRAINT "Room_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "managed_projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuildingServices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "hvacRooms" TEXT,
    "ducts" TEXT,
    "electricalRooms" TEXT,
    "mainFeeders" TEXT,
    "fixtures" TEXT,
    "risers" TEXT,
    CONSTRAINT "BuildingServices_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "managed_projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FireAndSafety" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "exitRoutes" TEXT,
    "firewalls" TEXT,
    "sprinklers" TEXT,
    CONSTRAINT "FireAndSafety_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "managed_projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Column" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "structuralSystemId" TEXT NOT NULL,
    "gridReference" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "depth" REAL NOT NULL,
    "reinforcement" TEXT,
    "loadCapacity" REAL,
    CONSTRAINT "Column_structuralSystemId_fkey" FOREIGN KEY ("structuralSystemId") REFERENCES "StructuralSystem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Beam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "structuralSystemId" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "length" REAL NOT NULL,
    "width" REAL NOT NULL,
    "depth" REAL NOT NULL,
    "material" TEXT NOT NULL,
    "loadCapacity" REAL,
    CONSTRAINT "Beam_structuralSystemId_fkey" FOREIGN KEY ("structuralSystemId") REFERENCES "StructuralSystem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Wall" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "structuralSystemId" TEXT NOT NULL,
    "startX" REAL NOT NULL,
    "startY" REAL NOT NULL,
    "endX" REAL NOT NULL,
    "endY" REAL NOT NULL,
    "thickness" REAL NOT NULL,
    "material" TEXT NOT NULL,
    "fireRating" TEXT,
    CONSTRAINT "Wall_structuralSystemId_fkey" FOREIGN KEY ("structuralSystemId") REFERENCES "StructuralSystem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Door" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "fireRating" TEXT,
    "hardware" TEXT,
    CONSTRAINT "Door_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Window" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "sillHeight" REAL NOT NULL,
    "glazing" TEXT,
    "thermal" TEXT,
    CONSTRAINT "Window_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StructuralSystem_projectId_key" ON "StructuralSystem"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildingServices_projectId_key" ON "BuildingServices"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "FireAndSafety_projectId_key" ON "FireAndSafety"("projectId");
