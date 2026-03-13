import { redirect } from "next/navigation";
import { AdminBackButton } from "@/components/ui/admin-back-button";
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

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminBackButton />
      {children}
    </div>
  );
}
