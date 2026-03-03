// app/admin/layout.tsx

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/");
  }

  return <>{children}</>;
}
