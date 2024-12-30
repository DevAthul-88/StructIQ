import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  const user = await getCurrentUser();

  try {
    // Optional: Add user authorization check
    const existingProject = await prisma.managedProject.findUnique({
      where: { id },
      select: { userId: true }
    });

    // Delete related entities first
    await prisma.material.deleteMany({
      where: { projectId: id }
    });

    await prisma.design.deleteMany({
      where: { projectId: id }
    });

    await prisma.layout.deleteMany({
      where: { projectId: id }
    });

    await prisma.structuralFeature.deleteMany({
      where: { projectId: id }
    });

    await prisma.dimension.deleteMany({
      where: { id: id }
    });

    // Finally delete the project
    const deletedProject = await prisma.managedProject.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Project deleted successfully", 
      project: deletedProject 
    }, { status: 200 });

  } catch (error) {
    console.error("Project deletion error:", error);

    return NextResponse.json({ 
      error: "Failed to delete project", 
      details: error.message 
    }, { status: 500 });
  }
}