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

    if (isCurrentMonth) {
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
      if (currentPlan.title === "Free" && projects >= 5) {
        return new Response(
          JSON.stringify({
            error: "Upgrade plan",
            details: "Project limit reached. Upgrade your plan to add more projects.",
            failed: true,
          }),
          { status: 200 }
        );
      }

      if (currentPlan.title === "Standard" && projects >= 50) {
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
          details: `Checked manager ID: ${projectManager}`,
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


    let dimensionId = null;
    // Create the main project
    const project = await prisma.managedProject.create({
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
        dimensionId, // Only passed if dimension was created
      },
    });

    // Create dimension if applicable

    if (length && width) {
      try {
        const dimension = await prisma.dimension.create({
          data: {
            length: parseFloat(length),
            width: parseFloat(width),
            height: height ? parseFloat(height) : null,
            units: `${lengthUnit}, ${widthUnit}, ${heightUnit || 'N/A'}`,
          },
        });
        dimensionId = dimension.id;
        console.log("Dimension created:", dimension);
      } catch (dimError) {
        console.error("Error creating dimension:", dimError);
        dimensionId = null;  // Ensure dimensionId is null if creation fails
      }
    }

    // Create related entities (Materials, Layout Preferences, Structural Features)
    if (materials && materials.length > 0) {
      await prisma.material.createMany({
        data: materials.map((material) => ({
          type: material.type,
          properties: material.properties,
          projectId: project.id,
        })),
      });
    }

    if (preferredLayoutType) {
      await prisma.layout.create({
        data: {
          type: preferredLayoutType,
          description: layoutDescription,
          projectId: project.id,
        },
      });
    }

    if (structuralFeatures && structuralFeatures.length > 0) {
      await prisma.structuralFeature.createMany({
        data: structuralFeatures.map((feature) => ({
          type: feature.type,
          description: feature.description,
          quantity: feature.quantity,
          projectId: project.id,
        })),
      });
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
    console.error("Comprehensive Error Details:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create project",
        details: error.message,
        fullError: error,
      }),
      { status: 500 }
    );
  }
}

