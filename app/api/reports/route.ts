// app/api/report/route.ts
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getCurrentUser } from "@/lib/session"
import { prisma } from "@/lib/db"
import { getUserSubscriptionPlan } from "@/lib/subscription";

const getStartOfMonth = () => {
    const date = new Date();
    date.setDate(1); // Set to the first day of the month
    date.setHours(0, 0, 0, 0); // Set to midnight
    return date;
  };

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
    try {

        const user = await getCurrentUser();
        const startOfMonth = getStartOfMonth();

        const subscription = await getUserSubscriptionPlan(user?.id);
      
        const currentPeriodEnd = new Date(subscription.stripeCurrentPeriodEnd);
        const isCurrentMonth = currentPeriodEnd >= startOfMonth;

        // Check authentication
        const session = await getCurrentUser()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const managersCount = await prisma.report.findMany({
            where: {
              userId: user?.id,
            },
          });
        
          if (isCurrentMonth) {
        
            // Check limits based on the subscription plan
            if (subscription.title === "Free") {
              if (managersCount.length >= 10) {
                return new Response(
                  JSON.stringify({
                    error: "Upgrade plan",
                    details: "Reports Create plan limit reached. Upgrade your plan to create more reports.",
                    failed: true,
                  }),
                  { status: 200 }
                );
              }
            }
        
            if (subscription.title === "Standard") {
        
              if (managersCount.length >= 100) {
                return new Response(
                  JSON.stringify({
                    error: "Upgrade plan",
                    details: "Reports Create plan limit reached. Upgrade your plan to create more reports.",
                    failed: true,
                  }),
                  { status: 200 }
                );
              }
            }
        
            if (subscription.title === "Premium") {
              // No limit for Premium plan
            }
          } else {
            // If the subscription has expired or is not in the current month, reset limits
            // Here you can handle logic to reset limits or renew subscription checks
            return new Response(
              JSON.stringify({
                error: "Subscription expired",
                details: "Your subscription has expired. Please renew to continue.",
                failed: true,
              }),
              { status: 200 }
            );
          }

        const { project, command } = await req.json()

        // Fetch managed project data with all relevant relations
        const projectData = await prisma.managedProject.findUnique({
            where: { id: project },
            include: {
                dimensions: true,
                layoutPreferences: true,
                materials: true,
                structuralFeatures: true,
                scenes: true,
                designs: true,
                manager: true,
            },
        })

        if (!projectData) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        // Calculate project progress
        const currentDate = new Date()
        const totalDuration = projectData.endDate.getTime() - projectData.startDate.getTime()
        const elapsedDuration = currentDate.getTime() - projectData.startDate.getTime()
        const progressPercentage = Math.min(Math.round((elapsedDuration / totalDuration) * 100), 100)

        // Format budget information
        const budgetInfo = projectData.budget
            ? `Budget: $${projectData.budget.toLocaleString()}`
            : "Budget: Not specified"

        // Generate report using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const prompt = `Generate a detailed project report with the following information:

Project Overview:
- Project Name: ${projectData.projectName}
- Client: ${projectData.clientName}
- Type: ${projectData.projectType}
- Status: ${projectData.projectStatus}
- Timeline: ${projectData.startDate.toLocaleDateString()} to ${projectData.endDate.toLocaleDateString()}
- ${budgetInfo}
- Current Progress: ${progressPercentage}%

Project Details:
- Architectural Style: ${projectData.architecturalStyle || 'Not specified'}
- Description: ${projectData.description || 'Not provided'}

Technical Specifications:
- Dimensions: ${JSON.stringify(projectData.dimensions)}
- Layout Preferences: ${JSON.stringify(projectData.layoutPreferences)}
- Materials Used: ${JSON.stringify(projectData.materials)}
- Structural Features: ${JSON.stringify(projectData.structuralFeatures)}

Current Progress:
- Number of Scenes: ${projectData.scenes.length}
- Number of Designs: ${projectData.designs.length}
- Project Manager: ${projectData.manager.name}

${command ? `Additional Analysis Requirements: ${command}` : ''}

Please provide a comprehensive report including:
1. Project Overview
2. Current Status and Progress
3. Technical Analysis
4. Timeline Assessment
5. Recommendations for Improvement
6. Risk Assessment (if any)
`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const report = response.text()

        // Save report to database
        const savedReport = await prisma.report.create({
            data: {
                content: report,
                projectId: project,
                userId: session?.id,
                command: command || null,
                reportType: command?.includes('financial') ? 'financial' : 'general',
            },
            include: {
                project: {
                    select: {
                        projectName: true,
                        clientName: true,
                        projectStatus: true,
                    },
                },
            },
        })

        return NextResponse.json({
            report: savedReport,
            projectProgress: progressPercentage,
        })
    } catch (error) {
        console.error("Report generation error:", error)
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        )
    }
}