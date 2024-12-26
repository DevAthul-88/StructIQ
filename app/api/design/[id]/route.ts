import { getCurrentUser } from '@/lib/session';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id } = params;

  // Get the current session
  const user = await getCurrentUser();

  if (!user?.id) {
    return new Response(
      JSON.stringify({ error: 'User not authenticated' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {

    const design = await prisma.design.findFirst({
        where: { id },
      });

    // Check if the project belongs to the authenticated user
    const project = await prisma.managedProject.findUnique({
      where: { id: design?.projectId },
      select: { userId: true },
    });

    if (!project) {
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify that the project belongs to the logged-in user
    if (project.userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access to this project' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the design data for the project
 

    if (!design) {
      return new Response(
        JSON.stringify({ error: 'Design not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ designData: JSON.parse(design.designData) }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching design:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch design data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
