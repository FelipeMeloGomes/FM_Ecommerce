"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import {
  type ComponentProps,
  forwardRef,
  memo,
  useCallback,
  useState,
} from "react";

import { Input } from "@/components/ui/input";

type PasswordInputProps = ComponentProps<"input"> & {
  showToggle?: boolean;
};

const PasswordInput = memo(
  forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, showToggle = true, ...props }, ref) => {
      const [showPassword, setShowPassword] = useState(false);

      const handleToggle = useCallback(() => {
        setShowPassword((prev) => !prev);
      }, []);

      const Icon = (showPassword ? EyeOff : Eye) as LucideIcon;

      return (
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={showToggle ? "pr-10" : className}
            {...props}
          />
          {showToggle && (
            <button
              type="button"
              onClick={handleToggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              <Icon className="h-4 w-4" />
            </button>
          )}
        </div>
      );
    },
  ),
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
