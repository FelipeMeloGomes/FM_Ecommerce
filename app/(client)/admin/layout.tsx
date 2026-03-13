import { redirect } from "next/navigation";
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb";
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
      <AdminBreadcrumb />
      {children}
    </div>
  );
}
