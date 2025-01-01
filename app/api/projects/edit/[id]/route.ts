import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function PUT(req, { params }) {
    const body = await req.json();
    const { id } = params;
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

    // Validate ID is present and not empty
    if (!id) {
        return new Response(
            JSON.stringify({ error: "Project ID is required" }),
            { status: 400 }
        );
    }

    const user = await getCurrentUser();

    try {
        // Validate manager existence
        const manager = await prisma.manager.findUnique({
            where: { id: projectManager },
        });

        if (!manager) {
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

            if (existingUser) {
                validUserId = user.id;
            }
        }

        // Find existing project to update
        const existingProject = await prisma.managedProject.findUnique({
            where: { id: id },  // Explicitly use id here
            include: {
                dimension: true,
                materials: true,
                layoutPreferences: true,
                structuralFeatures: true,
            },
        });

        if (!existingProject) {
            return new Response(
                JSON.stringify({ error: "Project not found", details: `Checked project ID: ${id}` }),
                { status: 404 }
            );
        }

        // Delete related entities first
        await prisma.material.deleteMany({
            where: { projectId: id },
        });
        await prisma.layout.deleteMany({
            where: { projectId: id },
        });
        await prisma.structuralFeature.deleteMany({
            where: { projectId: id },
        });

        let dimensionId = null;
        if (length && width) {
            try {
                // Check if an existing dimension is associated with the project
                const existingDimension = await prisma.dimension.findFirst({
                    where: { projectId: id }
                });

                if (existingDimension) {
                    // Update existing dimension
                    const updatedDimension = await prisma.dimension.update({
                        where: { id: existingDimension.id },
                        data: {
                            length: parseFloat(length),
                            width: parseFloat(width),
                            height: height ? parseFloat(height) : null,
                            units: `${lengthUnit}, ${widthUnit}, ${heightUnit || 'N/A'}`,
                            projectId: id
                        }
                    });
                    dimensionId = updatedDimension.id;
                    console.log("Dimension updated:", updatedDimension);
                } else {
                    // Create new dimension
                    const newDimension = await prisma.dimension.create({
                        data: {
                            length: parseFloat(length),
                            width: parseFloat(width),
                            height: height ? parseFloat(height) : null,
                            units: `${lengthUnit}, ${widthUnit}, ${heightUnit || 'N/A'}`,
                            projectId: id
                        }
                    });
                    dimensionId = newDimension.id;
                    console.log("Dimension created:", newDimension);
                }
            } catch (dimError) {
                console.error("Error handling dimensions:", dimError);
                dimensionId = null;
            }
        }

        // Update the main project
        const updatedProject = await prisma.managedProject.update({
            where: { id: id },  // Explicitly use id here
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

        // Create new related entities
        // Materials
        if (materials && materials.length > 0) {
            await prisma.material.createMany({
                data: materials.map((material) => ({
                    type: material.type,
                    properties: material.properties,
                    projectId: id,
                })),
            });
        }

        // Layout Preferences
        if (body.preferredLayoutType) {
            await prisma.layout.create({
                data: {
                    type: body.preferredLayoutType,
                    description: body.layoutDescription,
                    projectId: id,
                },
            });
        }

        // Structural Features
        if (structuralFeatures && structuralFeatures.length > 0) {
            await prisma.structuralFeature.createMany({
                data: structuralFeatures.map((feature) => ({
                    type: feature.type,
                    description: feature.description,
                    quantity: feature.quantity,
                    projectId: id,
                })),
            });
        }

        // Fetch the full updated project with relations
        const fullUpdatedProject = await prisma.managedProject.findUnique({
            where: { id: id },  // Explicitly use id here
            include: {
                dimension: true,
                materials: true,
                layoutPreferences: true,
                structuralFeatures: true,
                manager: true,
                user: true,
            },
        });

        return new Response(JSON.stringify({ success: true, project: fullUpdatedProject }), { status: 200 });
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
                error: "Failed to update project",
                details: error.message,
                fullError: error
            }),
            { status: 500 }
        );
    }
}