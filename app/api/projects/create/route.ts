import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";

const getStartOfMonth = () => {
  const date = new Date();
  date.setDate(1); // Set to the first day of the month
  date.setHours(0, 0, 0, 0); // Set to midnight
  return date;
};

export async function POST(req) {
  const startOfMonth = getStartOfMonth();
  const body = await req.json();
  const {
    budget,
    clientName,
    endDate,
    projectManager,
    projectName,
    projectStatus,
    projectType,
    startDate,
    description,
    length,
    lengthUnit,
    width,
    widthUnit,
    height,
    heightUnit,
    preferredLayoutType,
    layoutDescription,
    materials,
    architecturalStyle,
    structuralFeatures
  } = body;


  const user = await getCurrentUser();
  const currentPlan = await getUserSubscriptionPlan(user?.id);

  const currentPeriodEnd = new Date(currentPlan.stripeCurrentPeriodEnd);
  const isCurrentMonth = currentPeriodEnd >= startOfMonth;

  try {

    // Validate manager existence with detailed logging
    const manager = await prisma.manager.findUnique({
      where: { id: projectManager },
    });



      // Count projects created within the current month
      const projects = await prisma.managedProject.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: startOfMonth, // Filter projects created on or after the start of the current month
          },
        },
      });


      // Check limits based on the subscription plan
      if (currentPlan.title === "Free") {
        if (projects >= 5) {
          return new Response(
            JSON.stringify({
              error: "Upgrade plan",
              details: "Project limit reached. Upgrade your plan to add more projects.",
              failed: true,
            }),
            { status: 200 }
          );
        }
      }

      if (currentPlan.title === "Standard") {
        if (projects >= 50) {
          return new Response(
            JSON.stringify({
              error: "Upgrade plan",
              details: "Project limit reached. Upgrade your plan to add more projects.",
              failed: true,
            }),
            { status: 200 }
          );
        }
      }
    

      if (!manager) {
        console.error(`Manager not found with ID: ${projectManager}`);
        return new Response(
          JSON.stringify({
            error: "Manager not found",
            details: `Checked manager ID: ${projectManager}`
          }),
          { status: 400 }
        );
      }

      // Validate user if provided
      let validUserId = null;
      if (user?.id) {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (!existingUser) {
          console.error(`User not found with ID: ${user.id}`);
          validUserId = null;
        } else {
          validUserId = user.id;
        }
      }

      const project = await prisma.$transaction(async (tx) => {
        // Create the managed project first
        const managedProject = await tx.managedProject.create({
          data: {
            budget: parseFloat(budget),
            clientName,
            endDate: new Date(endDate),
            managerId: projectManager,
            projectName,
            projectStatus,
            projectType,
            startDate: new Date(startDate),
            description,
            architecturalStyle,
            userId: validUserId,
          },
        });
      
        // If dimensions are provided, create them and associate with the project
        if (length && width) {
          const dimension = await tx.dimension.create({
            data: {
              length: parseFloat(length),
              width: parseFloat(width),
              height: height ? parseFloat(height) : null,
              units: `${lengthUnit}, ${widthUnit}, ${heightUnit || 'N/A'}`,
              projectId: managedProject.id, // Link the dimension to the managed project
            },
          });
      
          // Update the managed project with the dimensionId
          await tx.managedProject.update({
            where: { id: managedProject.id },
            data: { dimensionId: dimension.id },
          });
        }
      
        // Return the created managed project with its related data
        return managedProject;
      });
      

 
      // Create related entities
      // Materials
      if (materials && materials.length > 0) {
        try {
          await prisma.material.createMany({
            data: materials.map((material) => ({
              type: material.type,
              properties: material.properties,
              projectId: project.id,
            })),
          });
          console.log("Materials created for project");
        } catch (matError) {
          console.error("Error creating materials:", matError);
        }
      }

      // Layout Preferences
      if (preferredLayoutType) {
        try {
          await prisma.layout.create({
            data: {
              type: preferredLayoutType,
              description: layoutDescription,
              projectId: project.id,
            },
          });
          console.log("Layout preference created");
        } catch (layoutError) {
          console.error("Error creating layout:", layoutError);
        }
      }

      // Structural Features
      if (structuralFeatures && structuralFeatures.length > 0) {
        try {
          await prisma.structuralFeature.createMany({
            data: structuralFeatures.map((feature) => ({
              type: feature.type,
              description: feature.description,
              quantity: feature.quantity,
              projectId: project.id,
            })),
          });
          console.log("Structural features created");
        } catch (featError) {
          console.error("Error creating structural features:", featError);
        }
      }

      // Fetch the full project with relations
      const fullProject = await prisma.managedProject.findUnique({
        where: { id: project.id },
        include: {
          dimensions: true,
          materials: true,
          layoutPreferences: true,
          structuralFeatures: true,
          manager: true,
          user: true,
        },
      });

      return new Response(JSON.stringify({ success: true, project: fullProject }), { status: 201 });
    } catch (error) {
      console.error("Comprehensive Error Details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack
      });

      return new Response(
        JSON.stringify({
          error: "Failed to create project",
          details: error.message,
          fullError: error
        }),
        { status: 500 }
      );
    }
  }
  