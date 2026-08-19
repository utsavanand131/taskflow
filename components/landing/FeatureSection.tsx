"use client";

import Image from "next/image";

interface FeatureSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

export default function FeatureSection({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div
        className={`grid items-center gap-6 lg:grid-cols-2 lg:gap-16 ${
          reverse ? "lg:[&>div:first-child]:order-2" : ""
        }`}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
            {eyebrow}
          </p>

          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            {description}
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-8 -z-10 bg-black/70 blur-3xl" />

          <div className="overflow-hidden border border-zinc-800 bg-zinc-950 shadow-[0_35px_100px_rgba(0,0,0,0.65)]">
            <Image
              src={image}
              alt={imageAlt}
              width={1600}
              height={1000}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
