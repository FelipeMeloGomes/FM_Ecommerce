import { notFound } from "next/navigation";
import { SanityBrandRepository } from "@/services/brands/SanityBrandRepository";
import EditBrandForm from "./EditBrandForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;
  const repository = new SanityBrandRepository();
  const brand = await repository.findById(id);

  if (!brand) {
    return notFound();
  }

  return <EditBrandForm brand={brand} />;
}
