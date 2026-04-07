"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig = {
  sm: { icon: 12 },
  md: { icon: 16 },
  lg: { icon: 20 },
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const sizeSizes = {
  sm: "32px",
  md: "40px",
  lg: "48px",
};

function getInitials(name: string | undefined | null): string {
  if (!name || name.trim().length === 0) return "";

  return name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  name,
  imageUrl,
  size = "md",
  className,
}: AvatarProps) {
  const initials = getInitials(name);
  const hasImage = imageUrl && imageUrl.trim().length > 0;
  const iconSize = sizeConfig[size];

  if (hasImage) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden shrink-0",
          sizeClasses[size],
          className,
        )}
      >
        <Image
          src={imageUrl}
          alt={name ? `Foto de ${name}` : "Foto do perfil"}
          fill
          className="object-cover"
          sizes={sizeSizes[size]}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-shop_orange/20 text-shop_orange font-medium shrink-0",
        sizeClasses[size],
        className,
      )}
    >
      {initials ? (
        <span className="select-none">{initials}</span>
      ) : (
        <User className="text-shop_orange" size={iconSize.icon} />
      )}
    </div>
  );
}
