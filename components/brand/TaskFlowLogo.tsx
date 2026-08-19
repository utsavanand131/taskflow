"use client";

import Image from "next/image";
import Link from "next/link";

interface TaskFlowLogoProps {
  variant?: "mark" | "wordmark";
  href?: string;
  className?: string;
  priority?: boolean;
}

export default function TaskFlowLogo({
  variant = "wordmark",
  href,
  className = "",
  priority = false,
}: TaskFlowLogoProps) {
  const src =
    variant === "mark" ? "/taskflow-logo.svg" : "/taskflow-wordmark.svg";

  const content = (
    <Image
      src={src}
      alt="TaskFlow"
      width={variant === "mark" ? 32 : 156}
      height={variant === "mark" ? 32 : 36}
      priority={priority}
      className={className}
    />
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} aria-label="TaskFlow home">
      {content}
    </Link>
  );
}
