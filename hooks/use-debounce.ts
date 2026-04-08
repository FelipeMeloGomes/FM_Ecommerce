"use client";

import { useEffect, useState } from "react";

interface UseDebounceOptions<T> {
  value: T;
  delay?: number;
}

export function useDebounce<T>({
  value,
  delay = 300,
}: UseDebounceOptions<T>): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
