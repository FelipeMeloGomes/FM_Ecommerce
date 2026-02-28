"use client";
import { SignInButton } from "@clerk/nextjs";

const SignIn = () => {
  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect"
      >
        Entrar
      </button>
    </SignInButton>
  );
};

export default SignIn;
