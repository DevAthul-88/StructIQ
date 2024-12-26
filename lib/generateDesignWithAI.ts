// lib/openai.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize OpenAI client with your API key
const genAI = new GoogleGenerativeAI(process.env.AI_KEY);

export async function generateProjectDataWithAI({
    project,
}: {
    project: any;
}) {
    try {
        if (!project) {
            throw new Error('Project data is undefined or invalid');
        }

        // 1. Generate Design Data (dimensions, layout, materials, etc.)
        const designData = await generateDesignData(project);

        // 2. Generate React.js code for Floor Plan visualization
        const floorPlanReactCode = await generateReactCodeForFloorPlan(project);

        // 3. Generate React.js code for 3D Model visualization
        const threeDModelReactCode = await generateReactCodeFor3DModel(project);

        // 4. Generate React.js code for Budget visualization
        const budgetVisualizationReactCode = await generateReactCodeForBudget(project);

        // 5. Generate React.js code for Timeline visualization
        const timelineVisualizationReactCode = await generateReactCodeForTimeline(project);

        // Return all the data as separate objects
        return {
            designData,
            floorPlanReactCode,
            threeDModelReactCode,
            budgetVisualizationReactCode,
            timelineVisualizationReactCode,
        };
    } catch (error) {
        console.error('Error generating project data with AI:', error);
        throw new Error('Error generating project data');
    }
}

// Helper function to generate design data
async function generateDesignData(project: any) {
    const prompt = `
      Generate detailed design data for the following project:
      - Project Name: ${project.projectName}
      - Project Type: ${project.projectType}
      - Client Name: ${project.clientName}
      - Architectural Style: ${project.architecturalStyle}
      - Dimensions: Length: ${project.dimensions.length} | Width: ${project.dimensions.width} | Height: ${project.dimensions.height} | Units: ${project.dimensions.units}
      - Layout Preferences: ${JSON.stringify(project.layoutPreferences)}
      - Materials: ${JSON.stringify(project.materials)}
      - Structural Features: ${JSON.stringify(project.structuralFeatures)}
      - Budget: ${project.budget}
      - Project Status: ${project.projectStatus}
      - Timeline: ${project.timeline}
      - Additional Notes: ${project.additionalNotes}
      - Visualization Preferences: ${JSON.stringify(project.visualizationPreferences)}

      Return the design data in a structured format with dimensions, layout, materials, and structural features.
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const designDataText = await response.text();
    return JSON.parse(designDataText); // Parse the response into structured design data
}

// Helper function to generate React code for Floor Plan
async function generateReactCodeForFloorPlan(project: any) {
    const prompt = `
      Generate React.js code for visualizing a floor plan for the following project:
      - Project Name: ${project.projectName}
      - Dimensions: Length: ${project.dimensions.length} | Width: ${project.dimensions.width} | Height: ${project.dimensions.height}

      Provide a simple React component that can display the floor plan based on these dimensions.
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reactCodeText = await response.text();
    return reactCodeText;
}

// Helper function to generate React code for 3D Model
async function generateReactCodeFor3DModel(project: any) {
    const prompt = `
      Generate React.js code for visualizing a 3D model of the following project:
      - Project Name: ${project.projectName}
      - Dimensions: Length: ${project.dimensions.length} | Width: ${project.dimensions.width} | Height: ${project.dimensions.height}

      Provide a simple React component that can display a 3D model representation of the project.
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reactCodeText = await response.text();
    return reactCodeText;
}

// Helper function to generate React code for Budget visualization
async function generateReactCodeForBudget(project: any) {
    const prompt = `
      Generate React.js code for visualizing the budget breakdown for the following project:
      - Project Name: ${project.projectName}
      - Budget: ${project.budget}
      - Labor Costs: ${project.laborCosts}
      - Material Costs: ${project.materialCosts}

      Provide a simple React component to display the budget breakdown (e.g., pie chart or bar chart).
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reactCodeText = await response.text();
    return reactCodeText;
}

// Helper function to generate React code for Timeline visualization
async function generateReactCodeForTimeline(project: any) {
    const prompt = `
      Generate React.js code for visualizing the project timeline for the following project:
      - Project Name: ${project.projectName}
      - Timeline: ${project.timeline}

      Provide a simple React component to display the project timeline (e.g., a Gantt chart or timeline slider).
    `;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reactCodeText = await response.text();
    return reactCodeText;
}
