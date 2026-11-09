import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './dbSchema';
let client: ReturnType<typeof postgres> | undefined;
export function getDatabase(){const url=process.env.DATABASE_URL;if(!url)return undefined;client ??= postgres(url,{max:1,prepare:false});return drizzle(client,{schema});}