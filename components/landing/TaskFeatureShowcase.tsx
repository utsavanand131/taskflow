"use client";

import Image from "next/image";

interface ShowcaseItem {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface TaskFeatureShowcaseProps {
  items: ShowcaseItem[];
}

export default function TaskFeatureShowcase({
  items,
}: TaskFeatureShowcaseProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
          Tasks & task details
        </p>

        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Everything important about a task, in one place.
        </h2>

        <p className="mt-5 text-sm leading-7 text-zinc-500 sm:text-base">
          Go beyond a task title and status. TaskFlow gives every task the
          context, collaboration tools, and details needed to move work forward.
        </p>
      </div>

      <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
        {items.map((item, index) => {
          const reverse = index % 2 === 1;

          return (
            <div
              key={item.title}
              className={`grid items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16 ${
                reverse ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
                  {item.eyebrow}
                </p>

                <h3 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
                  {item.description}
                </p>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute -inset-8 -z-10 bg-black/70 blur-3xl" />

                <div className="overflow-hidden border border-zinc-800 bg-zinc-950 shadow-[0_35px_100px_rgba(0,0,0,0.65)]">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={1600}
                    height={1000}
                    className="block h-auto w-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
