import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageTitleVariants = cva("text-foreground font-semibold tracking-tight", {
  variants: {
    size: {
      sm: "text-lg",
      default: "text-2xl md:text-3xl",
      lg: "text-3xl lg:text-4xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface PageTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof pageTitleVariants> {
  as?: "h1" | "h2" | "h3";
}

export function PageTitle({
  as: Component = "h1",
  size,
  className,
  children,
  ...props
}: PageTitleProps) {
  return (
    <Component
      className={cn(pageTitleVariants({ size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
