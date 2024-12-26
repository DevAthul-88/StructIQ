import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';

// Fetch projects by userId
export async function GET(request: Request) {
    try {
        // Extract userId from the query parameters
        const user = await getCurrentUser();
        const userId = user?.id;

        // Validate userId
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Missing userId parameter' },
                { status: 400 }
            );
        }

        // Fetch projects for the given userId
        const projects = await prisma.managedProject.findMany({
            where: { userId },
            include: {
                designs: true, // Include related designs, adjust as per your Prisma schema
            },
        });

        // Check if projects exist
        if (projects.length === 0) {
            return NextResponse.json(
                { success: false, message: 'No projects found for the given userId' },
                { status: 404 }
            );
        }

        // Return the projects
        return NextResponse.json({ success: true, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);

        // Internal server error response
        return NextResponse.json(
            { success: false, message: 'An error occurred while fetching projects' },
            { status: 500 }
        );
    }
}
