import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Free",
    description: "Get started with basic features",
    benefits: [
      "Generate up to 5 projects per month",
      "Generate up to 10 civil plans per month",
      "Export plans in PDF format",
      "Basic email support",
      "Generate up to 2 reports per month",
      "1 manager allowed",
    ],
    limitations: [
      "No access to advanced customization",
      "No team collaboration features",
      "Limited export formats",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Standard",
    description: "Perfect for professionals and small teams",
    benefits: [
      "Generate up to 50 projects per month",
      "Generate up to 100 civil plans per month",
      "Export plans in multiple formats (PDF, DWG)",
      "Custom branding for exported plans",
      "Priority email support",
      "Generate up to 20 reports per month",
      "Up to 3 managers allowed",
    ],
    limitations: [
      "No advanced AI-assisted optimization",
      "No team collaboration features",
    ],
    prices: {
      monthly: 10,
      yearly: 100,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Premium",
    description: "Best for large teams and enterprises",
    benefits: [
      "Unlimited project generation",
      "Unlimited civil plan generation",
      "Advanced customization options",
      "Access to AI-assisted optimization and cost estimation tools",
      "Export in all formats (PDF, DWG, DXF)",
      "Dedicated account manager",
      "Priority support with guaranteed response time",
      "Generate up to 50 reports per month",
      "Unlimited managers allowed",
    ],
    limitations: [],
    prices: {
      monthly: 25,
      yearly: 250,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];




export const plansColumns = [
  "starter",
  "pro",
  "business",
  "enterprise",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Access to Analytics",
    starter: true,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "All plans include basic analytics for tracking performance.",
  },
  {
    feature: "Custom Branding",
    starter: null,
    pro: "500/mo",
    business: "1,500/mo",
    enterprise: "Unlimited",
    tooltip: "Custom branding is available from the Pro plan onwards.",
  },
  {
    feature: "Priority Support",
    starter: null,
    pro: "Email",
    business: "Email & Chat",
    enterprise: "24/7 Support",
  },
  {
    feature: "Advanced Reporting",
    starter: null,
    pro: null,
    business: true,
    enterprise: "Custom",
    tooltip:
      "Advanced reporting is available in Business and Enterprise plans.",
  },
  {
    feature: "Dedicated Manager",
    starter: null,
    pro: null,
    business: null,
    enterprise: true,
    tooltip: "Enterprise plan includes a dedicated account manager.",
  },
  {
    feature: "API Access",
    starter: "Limited",
    pro: "Standard",
    business: "Enhanced",
    enterprise: "Full",
  },
  {
    feature: "Monthly Webinars",
    starter: false,
    pro: true,
    business: true,
    enterprise: "Custom",
    tooltip: "Pro and higher plans include access to monthly webinars.",
  },
  {
    feature: "Custom Integrations",
    starter: false,
    pro: false,
    business: "Available",
    enterprise: "Available",
    tooltip:
      "Custom integrations are available in Business and Enterprise plans.",
  },
  {
    feature: "Roles and Permissions",
    starter: null,
    pro: "Basic",
    business: "Advanced",
    enterprise: "Advanced",
    tooltip:
      "User roles and permissions management improves with higher plans.",
  },
  {
    feature: "Onboarding Assistance",
    starter: false,
    pro: "Self-service",
    business: "Assisted",
    enterprise: "Full Service",
    tooltip: "Higher plans include more comprehensive onboarding assistance.",
  },
  // Add more rows as needed
];
