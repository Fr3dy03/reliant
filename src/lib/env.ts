import { z } from 'zod';
export const envSchema = z.object({ RELIANT_SECRET_KEY: z.string().min(32).optional(), DATABASE_URL: z.string().url().optional(), BOT_TESTNET_RPC: z.string().url().default('https://rpc.bohr.life'), BOT_TESTNET_CHAIN_ID: z.coerce.number().int().default(968) });
export function getEnv(source: Record<string, string | undefined> = process.env){return envSchema.parse(source);}