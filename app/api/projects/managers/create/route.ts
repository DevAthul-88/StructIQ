import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { getUserSubscriptionPlan } from '@/lib/subscription';

const getStartOfMonth = () => {
  const date = new Date();
  date.setDate(1); // Set to the first day of the month
  date.setHours(0, 0, 0, 0); // Set to midnight
  return date;
};

export async function POST(req: Request) {
  const { managerName } = await req.json()
  const user = await getCurrentUser();
  const startOfMonth = getStartOfMonth();

  const subscription = await getUserSubscriptionPlan(user?.id);



  const currentPeriodEnd = subscription.stripeCurrentPeriodEnd
    ? new Date(subscription.stripeCurrentPeriodEnd)
    : new Date();

  const isCurrentMonth = currentPeriodEnd > new Date();


  const managersCount = await prisma.manager.findMany({
    where: {
      userId: user?.id,
    },
  });

 




    // Check limits based on the subscription plan
    if (subscription.title === "Free") {
      if (managersCount.length >= 10) {
        return new Response(
          JSON.stringify({
            error: "Upgrade plan",
            details: "Managers Create plan limit reached. Upgrade your plan to create more managers.",
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
            details: "Managers Create plan limit reached. Upgrade your plan to create more managers.",
            failed: true,
          }),
          { status: 200 }
        );
      }
    }

    if (subscription.title === "Premium") {
      // No limit for Premium plan
    }
  
  

  if (!managerName || typeof managerName !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid manager name' }), {
      status: 400,
    })
  }

  try {
    // Create a new manager in the database
    const newManager = await prisma.manager.create({
      data: {
        name: managerName,
        userId: user?.id
      },
    })

    return new Response(JSON.stringify(newManager), {
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Failed to add manager' }), {
      status: 500,
    })
  }
}
