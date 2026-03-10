import type { ShippingGateway } from "@/core/shipping/ShippingGateway";
import type { ShippingQuote } from "@/core/shipping/ShippingQuote";

interface MelhorEnvioServiceResponse {
  name: string;
  price: string | number;
  delivery_time: string | number;
}

const API_URL =
  "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate";

const normalizeServiceName = (name: string) => {
  return name.split(".")[0].trim();
};

export class MelhorEnvioGateway implements ShippingGateway {
  async calculate(
    zipCode: string,
    items: {
      weight: number;
      width: number;
      height: number;
      length: number;
      quantity: number;
    }[],
  ): Promise<ShippingQuote[]> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { postal_code: `${process.env.MELHOR_ENVIO_ORIGIN_CEP}` },
        to: { postal_code: zipCode },
        products: items,
      }),
    });

    const data: MelhorEnvioServiceResponse[] = await response.json();

    return data.map(
      (service): ShippingQuote => ({
        service: normalizeServiceName(service.name),
        price: Number(service.price),
        deliveryDays: Number(service.delivery_time),
      }),
    );
  }
}
