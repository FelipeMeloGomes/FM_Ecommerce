import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const socialLink = [
  {
    title: "Github",
    href: "https://github.com/FelipeMeloGomes",
    icon: <Github className="w-4 h-4" />,
  },
  {
    title: "Linkedin",
    href: "https://www.linkedin.com/in/felipemelog/",
    icon: <Linkedin className="w-4 h-4" />,
  },
];

const SocialMedia = React.memo(
  ({ className, iconClassName, tooltipClassName }: Props) => {
    return (
      <TooltipProvider>
        <div className={cn("flex items-center gap-3", className)}>
          {socialLink?.map((item) => (
            <Tooltip key={item?.title}>
              <TooltipTrigger asChild>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={item?.href}
                  className={cn(
                    "p-2 rounded-full bg-muted hover:bg-shop_dark_green hover:text-white transition-colors",
                    iconClassName,
                  )}
                >
                  {item?.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                className={cn(
                  "bg-background text-foreground border-border",
                  tooltipClassName,
                )}
              >
                {item?.title}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    );
  },
);

SocialMedia.displayName = "SocialMedia";

export default SocialMedia;
