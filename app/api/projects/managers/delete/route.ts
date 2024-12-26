import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function DELETE(req: Request) {
    const { managerId } = await req.json();
    const user = await getCurrentUser();

    console.log(managerId);
    

    if (!managerId || typeof managerId !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid manager ID' }), { 
            status: 400 
        });
    }

    try {
        const existingManager = await prisma.manager.findUnique({
            where: { id: managerId },
        });

        if (!existingManager || existingManager.userId !== user?.id) {
            return new Response(JSON.stringify({ error: 'Manager not found or unauthorized' }), {
                status: 404,
            });
        }

        await prisma.manager.delete({
            where: { id: managerId },
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to delete manager' }), {
            status: 500,
        });
    }
}