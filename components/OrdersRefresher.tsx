"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  intervalSeconds?: number;
}

export default function OrdersRefresher({ intervalSeconds = 10 }: Props) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [router, intervalSeconds]);

  return null;
}
