import type { ShippingGateway } from "@/core/shipping/ShippingGateway";
import type { ShippingQuote } from "@/core/shipping/ShippingQuote";
import { fetchWithRetry } from "@/lib/fetchWithRetry";

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

const isValidQuote = (s: MelhorEnvioServiceResponse) => {
  const name = normalizeServiceName(s.name ?? "");
  return (
    name.length > 0 &&
    !Number.isNaN(Number(s.price)) &&
    !Number.isNaN(Number(s.delivery_time))
  );
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
    const response = await fetchWithRetry(API_URL, {
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
      retries: 3,
      retryDelay: 1000,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Melhor Envio API error: ${response.status} - ${errorText || response.statusText}`,
      );
    }

    const data: MelhorEnvioServiceResponse[] = await response.json();

    return data.filter(isValidQuote).map((s) => ({
      service: normalizeServiceName(s.name),
      price: Number(s.price),
      deliveryDays: Number(s.delivery_time),
    }));
  }
}
