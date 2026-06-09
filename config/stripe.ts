import Stripe from "stripe";
import { getEnv } from "@/config/env";

export const stripe = new Stripe(getEnv("STRIPE_RESTRICTED_KEY"));
