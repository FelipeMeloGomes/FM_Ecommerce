"use client";
import { SignInButton } from "@clerk/nextjs";

const SignIn = () => {
  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        Entrar
      </button>
    </SignInButton>
  );
};

export default SignIn;
