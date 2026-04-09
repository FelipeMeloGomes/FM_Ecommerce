import React from "react";
import { cn } from "@/lib/utils";

const Container = React.memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
        {children}
      </div>
    );
  },
);

Container.displayName = "Container";

export default Container;
