import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Title = React.memo(({ children, className, style }: Props) => {
  return (
    <h2
      className={twMerge("text-2xl font-bold text-foreground", className)}
      style={style}
    >
      {children}
    </h2>
  );
});

Title.displayName = "Title";

export default Title;
