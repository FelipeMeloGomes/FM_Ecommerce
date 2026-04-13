"use client";

import { useUser } from "@clerk/nextjs";
import * as Popover from "@radix-ui/react-popover";
import { LogIn, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SignIn = memo(() => {
  const { isLoaded, user } = useUser();
  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        <Avatar>
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex items-center justify-center rounded-full transition-colors hover:bg-muted/80"
          aria-label="Menu de usuário"
        >
          <Avatar>
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-48 rounded-lg border border-border bg-background shadow-lg overflow-hidden z-50"
          sideOffset={8}
          align="end"
        >
          <div className="py-1">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Criar Conta
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});

SignIn.displayName = "SignIn";

export default SignIn;
