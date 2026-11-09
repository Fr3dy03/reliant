import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({ schema: './src/lib/dbSchema.ts', out: './drizzle', dialect: 'postgresql', dbCredentials: { url: process.env.DATABASE_URL ?? 'postgres://placeholder:placeholder@localhost:5432/reliant' } });