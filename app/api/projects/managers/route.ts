import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const user = await getCurrentUser();

    // Example for filtering by first name
    const search = searchParams.get('search') || ''; // Search query param

    try {
        // Fetch managers with optional filtering (by first name)
        const managers = await prisma.manager.findMany({
            where: {
                userId: user?.id
            }
        });

        return new Response(JSON.stringify(managers), { status: 200 });
    } catch (error) {
        console.log(error);
        
        return new Response(
            JSON.stringify({ error: 'Failed to fetch managers' }),
            { status: 500 }
        );
    }
}
