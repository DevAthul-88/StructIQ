// /app/api/designs/route.ts
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { NextResponse } from 'next/server'


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    

    if (!projectId) {
        return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })
    }

    try {
        const designs = await prisma.design.findMany({
            where: {
                projectId:projectId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
 
        
        return NextResponse.json(designs)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching designs' }, { status: 500 })
    }
}
