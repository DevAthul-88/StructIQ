import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const deleteDesign = async (id: string) => {
  await prisma.design.delete({
    where: { id },
  })
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json() // Parsing the body of the request

    if (!id) {
      return NextResponse.json(
        { message: 'Design ID is required' },
        { status: 400 }
      )
    }

    await deleteDesign(id)
    return NextResponse.json({ message: 'Design deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete design', error: error.message },
      { status: 500 }
    )
  }
}
