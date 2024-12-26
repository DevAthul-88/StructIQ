import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, newName } = body;
    const user = await getCurrentUser();

    // Validate inputs
    if (!id || typeof id !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid manager ID' }), {
            status: 400,
        });
    }

    if (!newName || typeof newName !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid manager name' }), {
            status: 400,
        });
    }

    try {
        // Check if the manager exists and belongs to the current user
        const existingManager = await prisma.manager.findUnique({
            where: { id: id },
        });

        if (!existingManager || existingManager.userId !== user?.id) {
            return new Response(JSON.stringify({ error: 'Manager not found or unauthorized' }), {
                status: 404,
            });
        }

        // Update the manager name
        const updatedManager = await prisma.manager.update({
            where: { id: id },
            data: { name: newName },
        });

        return new Response(JSON.stringify(updatedManager), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update manager' }), {
            status: 500,
        });
    }
}
