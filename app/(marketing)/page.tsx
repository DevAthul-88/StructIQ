import { infos } from "@/config/landing";
import Testimonials from "@/components/sections/testimonials";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { ChevronRight, FileTextIcon, LayersIcon, PencilIcon, RocketIcon, StarHalfIcon, StarIcon,  } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import HeroImage from '../../public/_static/2147785635.jpg'
import Image from "next/image";

export default function IndexPage() {
  return (
    <MaxWidthWrapper className="pt-20 ">

      <>
        {/* Hero */}
        <div className="mx-auto">
          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
            <div>
              <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
                Revolutionize your projects with <span className="text-[#6725da]">PlanAI</span>
              </h1>
              <p className="mt-3 text-lg text-gray-800 dark:text-neutral-400">
                Transform your civil planning process with AI. Generate detailed project reports,
                create comprehensive plans, and manage projects and teams efficiently.
              </p>
              {/* Buttons */}
              <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                <Link
                  className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#6725da] text-white hover:bg-[#5a20c4] focus:outline-none focus:bg-[#5a20c4] disabled:opacity-50 disabled:pointer-events-none"
                  href="/login"
                >
                  Get started
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <a
                  className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  href={`mailto:${siteConfig.mailSupport}`}
                >
                  Contact sales team
                </a>
              </div>
              {/* End Buttons */}
              {/* Review */}
              <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5">
                {/* Review */}
                <div className="py-5">
                  <div className="flex gap-x-1">
                    <StarIcon fill="#fff" className="w-5 h-5" />
                    <StarIcon fill="#fff" className="w-5 h-5" />
                    <StarIcon fill="#fff" className="w-5 h-5" />
                    <StarIcon fill="#fff" className="w-5 h-5" />
                    <StarIcon fill="#fff" className="w-5 h-5" />
                  </div>
                  <p className="mt-3 text-sm text-gray-800 dark:text-neutral-200">
                    <span className="font-bold">4.6</span> /5 - from 12k reviews
                  </p>
                  <div className="mt-5">
                    <h5>Google</h5>
                  </div>
                </div>
                {/* End Review */}
                {/* Review */}
                <div className="py-5">
                  <div className="flex gap-x-1">
                    <StarIcon fill="#fff" className="w-5 h-5" />
                    <StarIcon fill="#fff" className="w-5 h-5" />
                    <StarIcon fill="#fff" className="w-5 h-5" />
                    <StarIcon fill="#fff" className="w-5 h-5" />
                    <StarHalfIcon fill="#fff" className="w-5 h-5" />
                  </div>
                  <p className="mt-3 text-sm text-gray-800 dark:text-neutral-200">
                    <span className="font-bold">4.8</span> /5 - from 5k reviews
                  </p>
                  <div className="mt-5">
                    <h5>Forbes</h5>
                  </div>
                </div>
                {/* End Review */}
              </div>
              {/* End Review */}
            </div>
            {/* End Col */}
            <div className="relative ms-4">
              <Image
                className="w-full rounded-md"
                src={HeroImage}
                alt="Hero Image"
              />
              <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-neutral-800 dark:via-neutral-900/0 dark:to-neutral-900/0" />
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
        </div>

        {/* End Hero */}
      </>


      <>
        {/* Icon Blocks */}
        <div className="pt-20 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-12">
            {/* Icon Block */}
            <div>
              <div className="relative flex justify-center items-center size-12 bg-white rounded-xl before:absolute before:-inset-px before:-z-[1] before:bg-gradient-to-br before:from-[#6725da] before:via-transparent before:#4b0082 before:rounded-xl dark:bg-neutral-900">
                <LayersIcon className="shrink-0 size-6 text-[#6725da] dark:text-[#6725da]" />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Civil Plan Generation
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Automatically create precise and detailed civil project plans.
                </p>
              </div>
            </div>
            {/* End Icon Block */}
            {/* Icon Block */}
            <div>
              <div className="relative flex justify-center items-center size-12 bg-white rounded-xl before:absolute before:-inset-px before:-z-[1] before:bg-gradient-to-br before:from-[#6725da] before:via-transparent before:#4b0082 before:rounded-xl dark:bg-neutral-900">
                <PencilIcon className="shrink-0 size-6 text-[#6725da] dark:text-[#6725da]" />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Customizable Designs
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Adjust layouts and details to meet your project’s unique needs.
                </p>
              </div>
            </div>
            {/* End Icon Block */}
            {/* Icon Block */}
            <div>
              <div className="relative flex justify-center items-center size-12 bg-white rounded-xl before:absolute before:-inset-px before:-z-[1] before:bg-gradient-to-br before:from-[#6725da] before:via-transparent before:#4b0082 before:rounded-xl dark:bg-neutral-900">
                <FileTextIcon className="shrink-0 size-6 text-[#6725da] dark:text-[#6725da]" />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Comprehensive Reports
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Generate project reports with detailed insights and analytics.
                </p>
              </div>
            </div>
            {/* End Icon Block */}
            {/* Icon Block */}
            <div>
              <div className="relative flex justify-center items-center size-12 bg-white rounded-xl before:absolute before:-inset-px before:-z-[1] before:bg-gradient-to-br before:from-[#6725da] before:via-transparent before:#4b0082 before:rounded-xl dark:bg-neutral-900">
                <RocketIcon className="shrink-0 size-6 text-[#6725da] dark:text-[#6725da]" />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Project Management
                </h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">
                  Track and manage multiple projects with ease and efficiency.
                </p>
              </div>
            </div>
            {/* End Icon Block */}
          </div>
        </div>
        {/* End Icon Blocks */}
      </>

      <hr />

      <>
      <div className="pb-20">
  {/* Grid */}
  <div className="mt-5 lg:mt-16 grid lg:grid-cols-3 gap-8 lg:gap-12">
    <div className="lg:col-span-1">
      <h2 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
        We tackle the challenges start-ups face
      </h2>
      <p className="mt-2 md:mt-4 text-gray-500 dark:text-neutral-500">
        Beyond partnering with startups to drive digitalization, we’ve built enterprise solutions addressing common pain points encountered in various products and projects.
      </p>
    </div>
    {/* End Col */}
    <div className="lg:col-span-2">
      <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
        {/* Icon Block */}
        <div className="flex gap-x-5">
          <RocketIcon className="shrink-0 mt-1 size-6 text-[#6725da] dark:text-[#6725da]" />
          <div className="grow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Innovative Solutions
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
              Leveraging cutting-edge technology to craft solutions tailored to modern business needs.
            </p>
          </div>
        </div>
        {/* End Icon Block */}
        {/* Icon Block */}
        <div className="flex gap-x-5">
          <PencilIcon className="shrink-0 mt-1 size-6 text-[#6725da] dark:text-[#6725da]" />
          <div className="grow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              User-Centered Design
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
              We prioritize user experience, balancing functionality with aesthetics for delightful interactions.
            </p>
          </div>
        </div>
        {/* End Icon Block */}
        {/* Icon Block */}
        <div className="flex gap-x-5">
          <LayersIcon className="shrink-0 mt-1 size-6 text-[#6725da] dark:text-[#6725da]" />
          <div className="grow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Scalable Frameworks
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
              Build projects with frameworks designed for growth and flexibility.
            </p>
          </div>
        </div>
        {/* End Icon Block */}
        {/* Icon Block */}
        <div className="flex gap-x-5">
          <FileTextIcon className="shrink-0 mt-1 size-6 text-[#6725da] dark:text-[#6725da]" />
          <div className="grow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Comprehensive Documentation
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
              Extensive guides and resources to streamline integration and development.
            </p>
          </div>
        </div>
        {/* End Icon Block */}
      </div>
    </div>
    {/* End Col */}
  </div>
  {/* End Grid */}
</div>
      </>

      <hr />

      <Testimonials />





    </MaxWidthWrapper>
  );
}
