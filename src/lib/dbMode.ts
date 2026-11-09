export type StorageMode='postgres'|'local-fallback';
export function storageMode(env:Record<string,string|undefined>=process.env):StorageMode{return env.DATABASE_URL?'postgres':'local-fallback';}