import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./db";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel(
  {
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

interface CivilPlanInput {
  projectName: string;
  description?: string;
  planType: 'SITE_PLAN' | 'FLOOR_PLAN' | 'ELEVATION' | 'SECTION' | 'FOUNDATION' | 'STRUCTURAL';
  dimensions: {
    width: number;
    length: number;
    height?: number;
    scale: string;
  };
  specifications: {
    buildingType: string;
    constructionType: string;
    occupancyType: string;
    zoningClass?: string;
  };
  structuralElements: {
    foundations: string[];
    columns: string[];
    beams: string[];
    slabs: string[];
    walls: string[];
  };
  materials: {
    name: string;
    type: string;
    specifications: Record<string, any>;
  }[];
  utilities?: {
    electrical: boolean;
    plumbing: boolean;
    hvac: boolean;
    drainage: boolean;
  };
}


const BUILDING_CODES = {
  RESIDENTIAL: {
    MIN_CEILING_HEIGHT: 2400,
    MIN_ROOM_WIDTH: 2400,
    MIN_BEDROOM_AREA: 7000000,
    MIN_BATHROOM_AREA: 3500000,
    MIN_KITCHEN_AREA: 5000000,
    CORRIDOR_WIDTH: 1200,
    DOOR_WIDTH: 900,
    WINDOW_MIN_AREA: 0.1
  },
  COMMERCIAL: {
    MIN_CEILING_HEIGHT: 3000,
    MIN_ROOM_WIDTH: 3000,
    MIN_OFFICE_AREA: 9000000,
    MIN_CORRIDOR_WIDTH: 1800,
    DOOR_WIDTH: 1000,
    WINDOW_MIN_AREA: 0.15
  }
}


export async function generateCivilPlan(
  projectId: string,
  input: CivilPlanInput
): Promise<string> {
  try {



    const promptText = {
      text: `
        Generate a detailed 2D floor plan data that includes comprehensive project information, design specifications, and safety considerations along with the room layout.
    
        LAYOUT SPECIFICATIONS:

    1. Room Layout Structure:
       Generate rooms with the following characteristics:
       - Each room should have a unique ID and name (Room 1, Room 2, etc.)
       - Rooms should share walls where they connect
       - Wall segments should be properly broken at intersections
       - Support for L-shaped and rectangular rooms
       - Proper corner connections between rooms
       - Support for adjacent and interconnected spaces

    2. Wall Generation Rules:
       - Each wall segment should be a separate element with:
         * Unique ID
         * Start and end coordinates
         * Connection points with other walls
         * Type (shared or external)
         * Thickness (standard 150mm for interior, 200mm for exterior)
       - Walls must be properly segmented at intersections
       - No floating or disconnected wall segments
       - Proper T-junctions and corner connections

    3. Room Adjacency Rules:
       - Rooms can share walls with neighboring rooms
       - Wall segments should be split at room boundaries
       - Support for:
         * Side-by-side room arrangements
         * Corner-to-corner connections
         * T-shaped intersections
         * L-shaped room configurations

    4. Spatial Relationships:
       - Define clear boundaries between rooms
       - Maintain proper wall alignment
       - Account for wall thickness in room dimensions
       - Ensure no gaps between adjacent rooms
       - Handle corner conditions properly

    5. Generation Parameters:
       Room array input: ${input?.rooms}
       Each room should specify:
       {
         id: string,
         name: string,
         bounds: {
           corners: [
             {x: number, y: number},
             // ... additional corners for the room shape
           ]
         },
         walls: [
           {
             id: string,
             startPoint: {x: number, y: number},
             endPoint: {x: number, y: number},
             isShared: boolean,
             connectedRooms: string[]  // IDs of rooms sharing this wall
           }
         ]
       }

    6. Layout Validation Rules:
       - All rooms must be properly connected
       - No overlapping room spaces
       - No gaps between adjacent rooms
       - Walls must align perfectly at corners
       - Proper handling of T-junctions
       - Validate wall segment connections
       - Check for complete room enclosure

        PROJECT INFORMATION:
        1. Project Metadata:
           - Project ID: Generate unique ID (format: PROJ-YYYY-XXXX)
           - Design ID: Generate unique ID (format: DES-YYYY-XXXX)
           - Project Name: ${input?.projectName}
           - Client Name: ${input?.clientName}
           - Project Status: ${input?.status || "DESIGN_PHASE"}
           - Creation Date: ${input?.createdAt}
           - Last Modified: ${new Date().toISOString()}
           - Version: ${input?.version || "1.0.0"}
    
        2. Design Information:
           - Drawing Number: Generate unique (format: DWG-XXXX)
           - Scale: ${input?.scale || "1:50"}
           - Design Phase: ${input?.phase || "SCHEMATIC"}
           - Construction Type: ${input?.constructionType}
           - Building Classification: ${input?.buildingClass}
           - Occupancy Type: ${input?.occupancyType}
           - Floor Level: ${input?.floorLevel || "GROUND"}

    
        4. Fire Safety Specifications:
           - Fire Resistance Rating:
             * Exterior Walls: 2-hour rating
             * Interior Walls: 1-hour rating
             * Floor/Ceiling: 2-hour rating
           - Emergency Exits:
             * Maximum travel distance: 60m
             * Minimum exit width: 915mm
             * Number of exits required: Based on occupancy
           - Fire Protection Systems:
             * Sprinkler type and coverage
             * Fire alarm locations
             * Emergency lighting
             * Exit signs
           - Fire Compartmentation:
             * Maximum compartment size
             * Fire door specifications
             * Smoke barriers
    
        5. Safety and Compliance Features:
           - Fire Exits and Escape Routes:
             * Primary escape routes
             * Alternative escape routes
             * Assembly points
           - Emergency Systems:
             * Emergency lighting locations
             * Fire alarm pull stations
             * Fire extinguisher locations
             * Smoke detectors
           - Accessibility Features:
             * Wheelchair turning spaces
             * Accessible routes
             * Ramp specifications
             * Door clearances
    
        LAYOUT SPECIFICATIONS:
        [Previous layout specifications remain the same...]
    
        ADDITIONAL OUTPUT STRUCTURE:
        {
          "projectMetadata": {
            "projectId": string,
            "designId": string,
            "projectName": string,
            "clientName": string,
            "status": string,
            "version": string,
            "dates": {
              "created": string,
              "modified": string,
              "approved": string
            }
          },
          "designSpecifications": {
            "drawingNumber": string,
            "scale": string,
            "phase": string,
            "constructionType": string,
            "buildingClass": string,
            "occupancyType": string,
            "floorLevel": string
          },
          "compliance": {
            "buildingCode": string,
            "fireCode": string,
            "accessibilityCode": string,
            "energyCode": string,
            "seismicZone": string,
            "windZone": string,
            "climateZone": string
          },
          "fireSafety": {
            "fireRatings": {
              "exteriorWalls": string,
              "interiorWalls": string,
              "floorCeiling": string
            },
            "emergencyExits": {
              "locations": [{
                "id": string,
                "type": "primary" | "secondary",
                "position": {x: number, y: number},
                "width": number
              }],
              "travelDistances": [{
                "from": {x: number, y: number},
                "to": {x: number, y: number},
                "distance": number
              }]
            },
            "fireProtection": {
              "sprinklers": [{
                "id": string,
                "type": string,
                "position": {x: number, y: number},
                "coverage": number
              }],
              "fireAlarms": [{
                "id": string,
                "type": string,
                "position": {x: number, y: number}
              }],
              "emergencyLighting": [{
                "id": string,
                "type": string,
                "position": {x: number, y: number},
                "coverage": number
              }]
            }
          },
          "accessibility": {
            "accessibleRoutes": [{
              "id": string,
              "path": [{x: number, y: number}],
              "width": number
            }],
            "turningSpaces": [{
              "id": string,
              "position": {x: number, y: number},
              "diameter": number
            }],
            "ramps": [{
              "id": string,
              "start": {x: number, y: number},
              "end": {x: number, y: number},
              "slope": number,
              "width": number
            }]
          },

          {
  "rooms": {
    "elements": [
      {
        "id": "living-room",
        "name": "Living Room",
        "bounds": {
          "corners": [
            {"x": 0, "y": 400},
            {"x": 0, "y": 800},
            {"x": 600, "y": 800},
            {"x": 600, "y": 400}
          ],
          "area": 240000
        },
        "walls": [
          {
            "id": "living-wall-north",
            "startPoint": {"x": 0, "y": 400},
            "endPoint": {"x": 600, "y": 400},
            "isShared": true,
            "connections": [
              {
                "wallId": "dining-wall-south",
                "point": {"x": 300, "y": 400},
                "type": "T-junction"
              }
            ]
          }
        ]
      },
      {
        "id": "dining-room",
        "name": "Dining Room",
        "bounds": {
          "corners": [
            {"x": 600, "y": 400},
            {"x": 600, "y": 700},
            {"x": 900, "y": 700},
            {"x": 900, "y": 400}
          ],
          "area": 90000
        },
        "walls": [
          {
            "id": "dining-wall-west",
            "startPoint": {"x": 600, "y": 400},
            "endPoint": {"x": 600, "y": 700},
            "isShared": true,
            "connections": [
              {
                "wallId": "living-wall-east",
                "point": {"x": 600, "y": 550},
                "type": "corner"
              }
            ]
          }
        ]
      },
      {
        "id": "master-bedroom",
        "name": "Master Bedroom",
        "bounds": {
          "corners": [
            {"x": 900, "y": 400},
            {"x": 900, "y": 800},
            {"x": 1300, "y": 800},
            {"x": 1300, "y": 400}
          ],
          "area": 160000
        },
        "walls": [
          {
            "id": "master-wall-north",
            "startPoint": {"x": 900, "y": 400},
            "endPoint": {"x": 1300, "y": 400},
            "isShared": true,
            "connections": [
              {
                "wallId": "master-bath-south",
                "point": {"x": 1100, "y": 400},
                "type": "corner"
              }
            ]
          }
        ]
      },
      {
        "id": "master-bath",
        "name": "Master Bathroom",
        "bounds": {
          "corners": [
            {"x": 1000, "y": 200},
            {"x": 1000, "y": 400},
            {"x": 1300, "y": 400},
            {"x": 1300, "y": 200}
          ],
          "area": 60000
        },
        "walls": [
          {
            "id": "master-bath-south",
            "startPoint": {"x": 1000, "y": 400},
            "endPoint": {"x": 1300, "y": 400},
            "isShared": true,
            "connections": []
          }
        ]
      },
      {
        "id": "bedroom-02",
        "name": "Guest Bedroom",
        "bounds": {
          "corners": [
            {"x": 600, "y": -400},
            {"x": 600, "y": -100},
            {"x": 900, "y": -100},
            {"x": 900, "y": -400}
          ],
          "area": 90000
        },
        "walls": [
          {
            "id": "guest-wall-south",
            "startPoint": {"x": 600, "y": -100},
            "endPoint": {"x": 900, "y": -100},
            "isShared": true,
            "connections": [
              {
                "wallId": "hall-wall-north",
                "point": {"x": 750, "y": -100},
                "type": "T-junction"
              }
            ]
          }
        ]
      },
      {
        "id": "laundry-room",
        "name": "Laundry Room",
        "bounds": {
          "corners": [
            {"x": 900, "y": -200},
            {"x": 900, "y": 0},
            {"x": 1100, "y": 0},
            {"x": 1100, "y": -200}
          ],
          "area": 40000
        },
        "walls": [
          {
            "id": "laundry-wall-west",
            "startPoint": {"x": 900, "y": -200},
            "endPoint": {"x": 900, "y": 0},
            "isShared": true,
            "connections": []
          }
        ]
      },
      {
        "id": "garage",
        "name": "Two-Car Garage",
        "bounds": {
          "corners": [
            {"x": -400, "y": -200},
            {"x": -400, "y": 200},
            {"x": 0, "y": 200},
            {"x": 0, "y": -200}
          ],
          "area": 160000
        },
        "walls": [
          {
            "id": "garage-wall-east",
            "startPoint": {"x": 0, "y": -200},
            "endPoint": {"x": 0, "y": 200},
            "isShared": true,
            "connections": [
              {
                "wallId": "kitchen-wall-west",
                "point": {"x": 0, "y": 0},
                "type": "corner"
              }
            ]
          }
        ]
      },
      {
        "id": "study",
        "name": "Home Office/Study",
        "bounds": {
          "corners": [
            {"x": 200, "y": -400},
            {"x": 200, "y": -200},
            {"x": 500, "y": -200},
            {"x": 500, "y": -400}
          ],
          "area": 60000
        },
        "walls": [
          {
            "id": "study-wall-south",
            "startPoint": {"x": 200, "y": -200},
            "endPoint": {"x": 500, "y": -200},
            "isShared": true,
            "connections": [
              {
                "wallId": "hall-wall-north",
                "point": {"x": 350, "y": -200},
                "type": "corner"
              }
            ]
          }
        ]
      }
    ]
  }
},
      "walls": {
        "elements": [
          {
            "id": string,
            "startPoint": {x: number, y: number},
            "endPoint": {x: number, y: number},
            "thickness": number,
            "type": "interior" | "exterior",
            "connections": [
              {
                "wallId": string,
                "point": {x: number, y: number},
                "type": "T-junction" | "corner"
              }
            ],
            "sharedBy": string[]  // Room IDs
          }
        ]
      },
      "metadata": {
        "gridSize": number,
        "scale": number,
        "units": "mm",
        "boundingBox": {
          "minX": number,
          "minY": number,
          "maxX": number,
          "maxY": number
        }
      },

       "project_summary": {
    "estimated_budget": "${input.budget}",
    "labor_charges": {
      "percentage_of_budget": "20%",
      "breakdown": {
        "project_management": "5%",
        "skilled_labor": "10%",
        "administrative_support": "5%"
      }
    },
    "total_budget": "${input.budget + (input.budget * 0.20)}",
    "time_to_completion": "12 weeks",
    "required_materials": [
      {
        "item": "Steel",
        "approximate_cost": "$5,000"
      },
      {
        "item": "Cement",
        "approximate_cost": "$2,000"
      },
      {
        "item": "Wood",
        "approximate_cost": "$1,500"
      },
      {
        "item": "Electrical Wiring",
        "approximate_cost": "$1,200"
      }
    ],
    "required_equipment": [
      "Excavator",
      "Concrete Mixer",
      "Forklift",
      "Generator"
    ],
    "personnel_needed": [
      "Project Manager",
      "Construction Workers",
      "Electricians",
      "Plumbers",
      "Safety Officers"
    ],
    "environmental_considerations": [
      "Energy efficiency: Use energy-efficient lighting and equipment",
      "Waste management: Ensure proper recycling and disposal of materials",
      "Sustainable sourcing of materials to reduce carbon footprint"
    ]
  }
        
        }
    
        Generate a complete floor plan that includes all project information, safety considerations, and proper room layout with wall connectivity. Ensure all safety and compliance features are properly positioned and documented.
      `
    };


    const result = await model.generateContent(promptText.text);
    const responseText = result.response?.text();

    if (!responseText) {
      throw new Error("No response from AI model.");
    }

    // Check if response is valid JSON before parsing
    try {
      const sceneData = JSON.parse(responseText);

      const design = await prisma.design.create({
        data: {
          projectId: projectId,
          designData: JSON.stringify(sceneData),
        },
      });

      return design.id;
    } catch (error) {
      console.error("Error parsing AI response as JSON:", error);
      throw new Error("Failed to generate civil engineering plan: Invalid AI response format.");
    }
  } catch (error) {
    console.error("Error generating civil engineering plan:", error);
    throw new Error("Failed to generate civil engineering plan.");
  }
}

