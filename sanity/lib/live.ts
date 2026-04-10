import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
});

export const sanityFetchStatic = async <T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T | null> => {
  try {
    const response = await client.fetch<T>(query, params ?? {});
    return response;
  } catch (error) {
    console.error("Static fetch error:", error);
    return null;
  }
};
