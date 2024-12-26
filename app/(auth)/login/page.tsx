import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/forms/user-auth-form"
import { Icons } from "@/components/shared/icons"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import LogoDark from 'public/_static/logo_dark.png'
import LogoLight from 'public/_static/logo_light.png'

export const metadata: Metadata = {
  title: "Login | – StructIQ",
  description: "Login to your account to access personalized features and content.",
}

export default function LoginPage() {
  return (
    <main className="container flex min-h-screen items-center justify-center py-10">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <Icons.chevronLeft className="mr-2 size-4" aria-hidden="true" />
        <span>Back</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
          <Image
              src={LogoDark}
              width={150}
              alt="logo"
              className="inline-block dark:hidden"
            />
            <Image
              src={LogoLight}
              alt="logo dark version"
              width={150}
              className="hidden dark:inline-block"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <UserAuthForm />
          </Suspense>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <span>Don&apos;t have an account? </span>
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
          >
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}

