// app/api/dashboard/route.ts
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const user = await getCurrentUser();
    const [
      totalUsers,
      totalReports,
      totalProjects,
      totalManagers,
      totalDesigns,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.report.count({
        where: {
          userId: user?.id,
        }
      }),
      prisma.managedProject.count({
        where: {
          userId: user?.id,
        }
      }),
      prisma.manager.count({
        where: {
          userId: user?.id,
        }
      }),
      prisma.design.count({
        where: {
          project: {
            userId: user?.id
          }
        }
      })
    ]);

    return NextResponse.json({
      totalUsers,
      totalReports,
      totalProjects,
      totalManagers,
      totalDesigns
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}