import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest, 
  { params }: { params: { userId: string } }
) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch projects for the current user
    const projects = await prisma.managedProject.findMany({
      where: { userId: user.id },
      include: {
        dimension: true,
        materials: true,
        layoutPreferences: true,
        structuralFeatures: true,
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: projects,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user projects', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
