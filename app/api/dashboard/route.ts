// app/api/dashboard/route.ts
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const [
      totalUsers,
      totalReports,
      totalProjects,
      totalManagers,
      totalDesigns,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.report.count(),
      prisma.managedProject.count(),
      prisma.manager.count(),
      prisma.design.count(),
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