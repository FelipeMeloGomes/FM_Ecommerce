"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";

interface GlobalErrorWrapperProps {
  children: React.ReactNode;
}

export function GlobalErrorWrapper({ children }: GlobalErrorWrapperProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
