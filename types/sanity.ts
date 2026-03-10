import type { Patch, SanityClient, Transaction } from "@sanity/client";

export type SanityCreatePayload<T extends Record<string, unknown>> = T & {
  _type: string;
  _id?: string;
};

export type SanityPatchPayload = {
  set?: Record<string, unknown>;
  setIfMissing?: Record<string, unknown>;
  unset?: string[];
  inc?: Record<string, number>;
  dec?: Record<string, number>;
};

export interface SanityDeleteResult {
  transactionId: string;
  documentId: string;
}

export type SanityClientInstance = SanityClient;

export type SanityPatch = Patch;
export type SanityTransaction = Transaction;
