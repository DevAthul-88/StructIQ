import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Icons } from "../shared/icons";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";
import LogoDark from 'public/_static/logo_dark.png'
import LogoLight from 'public/_static/logo_light.png'

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container max-w-6xl py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
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
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering civil engineers with AI-driven solutions for efficient planning.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link href="/" className="text-sm font-medium hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm font-medium hover:text-primary">
                    Pricing
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`mailto:${siteConfig.mailSupport}`}>
                  <Mail className="size-5" />
                  <span className="sr-only">Email</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
                  <Icons.twitter className="size-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                  <Icons.gitHub className="size-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
