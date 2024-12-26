import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'



const querySchema = z.object({
  userId: z.string().cuid(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const validatedParams = querySchema.parse({ userId })

    const projects = await prisma.report.findMany({
      where: {
        userId: validatedParams.userId,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        project:true
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 })
    }
    console.error('Request error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
