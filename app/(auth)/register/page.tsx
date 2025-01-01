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
  title: "Register – StructIQ",
  description: "Create your account to get started with StructIQ.",
}

export default function RegisterPage() {
  return (
    <main className="container flex min-h-screen items-center justify-center py-10">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
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
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to create your account
          </p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <UserAuthForm type="register" />
          </Suspense>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              <span>Already have an account? </span>
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}