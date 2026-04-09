"use client";

import { useCallback, useState } from "react";

interface UseFilterSelectionOptions {
  initialValue?: string | null;
}

interface UseFilterSelectionReturn {
  selected: string | null;
  select: (value: string) => void;
  clear: () => void;
  toggle: (value: string) => void;
  isSelected: (value: string) => boolean;
}

export function useFilterSelection(
  options: UseFilterSelectionOptions = {},
): UseFilterSelectionReturn {
  const { initialValue = null } = options;
  const [selected, setSelected] = useState<string | null>(initialValue);

  const select = useCallback((value: string) => {
    setSelected(value);
  }, []);

  const clear = useCallback(() => {
    setSelected(null);
  }, []);

  const toggle = useCallback((value: string) => {
    setSelected((prev) => (prev === value ? null : value));
  }, []);

  const isSelected = useCallback(
    (value: string) => selected === value,
    [selected],
  );

  return {
    selected,
    select,
    clear,
    toggle,
    isSelected,
  };
}
