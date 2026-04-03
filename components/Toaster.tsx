"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      theme="light"
      toastOptions={{
        className: "font-poppins",
        style: {
          background: "#000",
          color: "#fff",
        },
      }}
    />
  );
}
