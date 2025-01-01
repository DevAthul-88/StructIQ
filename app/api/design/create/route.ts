// app/api/submit-form/route.ts
import { prisma } from '@/lib/db';
import { generateCivilPlan } from '@/lib/generateBabylonScene';
import { getCurrentUser } from '@/lib/session';
import { getUserSubscriptionPlan } from '@/lib/subscription';
import { NextResponse } from 'next/server';

const getStartOfMonth = () => {
  const date = new Date();
  date.setDate(1); // Set to the first day of the month
  date.setHours(0, 0, 0, 0); // Set to midnight
  return date;
};

export async function POST(request: Request) {
  const startOfMonth = getStartOfMonth();
  try {
    const data = await request.json();
    const { project, visualizationPreferences, additionalNotes } = data;
    const user = await getCurrentUser(); // Assuming the user info is available
    let userId = user?.id
    const subscription = await getUserSubscriptionPlan(user?.id);

    const currentPeriodEnd = new Date(subscription.stripeCurrentPeriodEnd);
    const isCurrentMonth = currentPeriodEnd >= startOfMonth;


    const civilPlans = await prisma.design.findMany({
      where: {
        project: {
          userId: user?.id,
        },
        createdAt: {
          gte: startOfMonth,
        },
      },
      include: {
        project: true, // Include related project details
      },
    });


    

      // Check limits based on the subscription plan
      if (subscription.title === "Free") {
        if (civilPlans.length >= 10) {
          return new Response(
            JSON.stringify({
              error: "Upgrade plan",
              details: "Design limit reached. Upgrade your plan to create more designs.",
              failed: true,
            }),
            { status: 200 }
          );
        }
      }

      if (subscription.title === "Standard") {

        if (civilPlans.length >= 100) {
          return new Response(
            JSON.stringify({
              error: "Upgrade plan",
              details: "Civil plan limit reached. Upgrade your plan to create more plans.",
              failed: true,
            }),
            { status: 200 }
          );
        }
      }

      if (subscription.title === "Premium") {
        // No limit for Premium plan
      }
   


    // Fetch the project data
    const projectData = await prisma.managedProject.findUnique({
      where: { id: project, userId: userId },
      include: {
        dimensions: true,
        layoutPreferences: true,
        materials: true,
        structuralFeatures: true,
        manager: { select: { name: true, id: true } },
      },
    });

    if (!projectData) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Prepare project data for AI processing, including design preferences and additional notes
    const projectDetails = {
      projectName: projectData.projectName,
      projectType: projectData.projectType,
      planType: projectData.projectType,
      clientName: projectData.clientName,
      architecturalStyle: projectData.architecturalStyle || 'Unknown',
      dimensions: projectData.dimensions
        ? {
          length: projectData.dimensions.length,
          width: projectData.dimensions.width,
          height: projectData.dimensions.height || 0,
          units: projectData.dimensions.units,
        }
        : null,
      layoutPreferences: projectData.layoutPreferences.map((layout) => ({
        type: layout.type,
        description: layout.description || '',
      })),
      materials: projectData.materials.map((material) => ({
        type: material.type,
        properties: material.properties || '',
      })),
      structuralFeatures: projectData.structuralFeatures.map((feature) => ({
        type: feature.type,
        description: feature.description || '',
        quantity: feature.quantity || 0,
      })),
      budget: projectData.budget || 0,
      projectStatus: projectData.projectStatus,
      timeline: projectData.startDate ? `Start Date: ${projectData.startDate}` : '',
      additionalNotes: projectData.description || '',

      // Adding visualization preferences and additional notes to AI input
      visualizationPreferences, // You may use these preferences to guide the design
      additionalNotes: additionalNotes || '', // Any extra context or specifications for the design
      specifications: {
        buildingType: projectData.buildingType || 'Unknown',  // Add a default value or extract from projectData
      },
      rooms: 4,
      budget: projectData.budget
    };



    // Step 1: Send the project data to AI to generate a design or other results
    const generatedDesign = await generateCivilPlan(project, projectDetails);

    return NextResponse.json({
      message: 'Design generated successfully and saved',
      generatedDesign: generatedDesign
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating design:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}

