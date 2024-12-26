// app/api/dashboard/charts/route.ts
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get last 7 days
    const dates = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return new Date(date.setHours(0, 0, 0, 0));
    }).reverse();

    const chartData = await Promise.all(
      dates.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);

        const [projects, designs] = await Promise.all([
          prisma.managedProject.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDay,
              },
            },
          }),
          prisma.design.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDay,
              },
            },
          }),
        ]);

        return {
          date: date.toISOString(),
          projects,
          designs,
        };
      })
    );

    return NextResponse.json({ chartData });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}