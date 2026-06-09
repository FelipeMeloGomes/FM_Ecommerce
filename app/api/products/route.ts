import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_VARIANT_QUERY } from "@/sanity/queries/query";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const variant = searchParams.get("variant");
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 200);

  if (!variant) {
    return NextResponse.json(
      { error: "Variant query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const products = await client.fetch(PRODUCTS_BY_VARIANT_QUERY, {
      variant: variant.toLowerCase(),
      limit,
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
