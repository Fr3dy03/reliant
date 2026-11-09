import crypto from 'node:crypto';
type Nonce={value:string;address:string;expiresAt:number;used:boolean};
const nonces=new Map<string,Nonce>();
export function createNonce(address:string, now=Date.now()){const value=crypto.randomBytes(24).toString('hex');nonces.set(value,{value,address:address.toLowerCase(),expiresAt:now+5*60_000,used:false});return value;}
export function consumeNonce(value:string,address:string,now=Date.now()){const nonce=nonces.get(value);if(!nonce||nonce.used||nonce.expiresAt<now||nonce.address!==address.toLowerCase())return false;nonce.used=true;return true;}
export function clearNonces(){nonces.clear();}