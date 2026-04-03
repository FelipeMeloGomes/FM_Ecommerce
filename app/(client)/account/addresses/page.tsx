import { getAddresses } from "@/actions/getAddresses";
import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import AddressesClient from "./AddressClient";

type Props = {
  searchParams: Promise<{ edit?: string }>;
};

export default async function AddressesPage({ searchParams }: Props) {
  const params = await searchParams;
  const addresses = await getAddresses();

  return (
    <Container>
      <div className="py-8 lg:py-12">
        <div className="flex flex-col gap-2 mb-8">
          <Badge
            variant="outline"
            className="w-fit border-shop_orange text-shop_orange text-xs uppercase tracking-widest"
          >
            Minha Conta
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold">Meus Endereços</h1>
          <p className="text-muted-foreground text-lg">
            Gerencie seus endereços de entrega
          </p>
        </div>

        <AddressesClient addresses={addresses} initialEditId={params.edit} />
      </div>
    </Container>
  );
}
