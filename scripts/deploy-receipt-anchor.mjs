import { createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { readFileSync } from 'node:fs';

const env = readFileSync('.env.local', 'utf8');
const get = (name) => env.match(new RegExp(`^${name}=(.+)$`, 'm'))?.[1];
const privateKey = get('RELIANT_DEPLOYER_PRIVATE_KEY');
if (!privateKey) throw new Error('Missing RELIANT_DEPLOYER_PRIVATE_KEY in .env.local');
const chain = defineChain({ id: 968, name: 'Bohr Testnet', nativeCurrency: { name: 'BOT', symbol: 'BOT', decimals: 18 }, rpcUrls: { default: { http: [get('BOT_TESTNET_RPC') ?? 'https://rpc.bohr.life'] } } });
const account = privateKeyToAccount(privateKey);
const publicClient = createPublicClient({ chain, transport: http() });
const balance = await publicClient.getBalance({ address: account.address });
if (balance === 0n) throw new Error(`Deployer has no BOT balance: ${account.address}`);
throw new Error('Deployment intentionally paused until the deployer is funded and deployment is explicitly authorized.');