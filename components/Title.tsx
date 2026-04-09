import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Title = React.memo(({ children, className }: Props) => {
  return (
    <h2 className={twMerge("text-2xl font-bold text-foreground", className)}>
      {children}
    </h2>
  );
});

Title.displayName = "Title";

export default Title;
