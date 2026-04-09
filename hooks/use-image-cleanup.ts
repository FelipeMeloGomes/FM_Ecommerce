"use client";

import { useEffect } from "react";

export function useImageCleanup(url: string | null | undefined): void {
  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);
}
