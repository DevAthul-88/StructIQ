import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { NextResponse } from 'next/server';


export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const user = await getCurrentUser();

  try {
    const projectData = await prisma.managedProject.findUnique({
      where: { id, userId: user?.id },
      include: {
        dimension: true,
        layoutPreferences: true,
        materials: true,
        structuralFeatures: true,
        manager: {
          select: { name: true, id: true },
        },
      },
    });

    if (!projectData) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = {
      id: projectData.id,
      projectName: projectData.projectName,
      projectType: projectData.projectType,
      clientName: projectData.clientName,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      budget: projectData.budget || 0,
      projectStatus: projectData.projectStatus,
      description: projectData.description || '',
      architecturalStyle: projectData.architecturalStyle || 'Unknown',
      dimensions: projectData.dimension
        ? {
          length: projectData.dimension.length,
          width: projectData.dimension.width,
          height: projectData.dimension.height || 0,
          units: projectData.dimension.units,
        }
        : null,
      layoutPreferences: projectData.layoutPreferences.map((layout) => ({
        id: layout.id,
        type: layout.type,
        description: layout.description || '',
      })),
      materials: projectData.materials.map((material) => ({
        id: material.id,
        type: material.type,
        properties: material.properties || '',
      })),
      structuralFeatures: projectData.structuralFeatures.map((feature) => ({
        id: feature.id,
        type: feature.type,
        description: feature.description || '',
        quantity: feature.quantity || 0,
      })),
      manager: {
        name: projectData.manager?.name || 'Unknown',
        id: projectData.manager?.id || null,
      },
    };

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
