import { Suspense } from "react";
import SuccessPageContent from "@/components/SuccessPageContent";

type Props = {
  searchParams: Promise<{ orderNumber?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <SuccessPageContent initialOrderNumber={params.orderNumber} />
    </Suspense>
  );
}
