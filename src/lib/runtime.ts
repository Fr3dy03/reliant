import { promises as fs } from 'node:fs';
import path from 'node:path';
import { evaluate, EvalResult } from './evaluators';
import { demo, Case, Run } from './store';
import { decryptSecret, encryptSecret } from './secrets';

export type Connection = { endpoint: string; version: string; authType: 'none'|'bearer'|'x-api-key'; secret?: string; secretHint?: string };
type Stored = { runs: Run[]; cases: Case[]; connection?: Connection };
const file = path.join(process.cwd(), '.reliant-data.json');
let memory: Stored | undefined;

async function load(): Promise<Stored> {
  if (memory) return memory;
  try { memory = JSON.parse(await fs.readFile(file, 'utf8')) as Stored; }
  catch { memory = { runs: demo.runs, cases: demo.cases }; await save(memory); }
  return memory;
}
async function save(value: Stored) { memory = value; await fs.writeFile(file, JSON.stringify(value, null, 2), 'utf8'); }
export async function listRuns() { return (await load()).runs; }
export async function getPersistedRun(id: string) { return (await load()).runs.find(run => run.id === id); }
export async function appendCases(cases: Case[]) { const db = await load(); await save({ ...db, cases: [...db.cases, ...cases] }); return cases.length; }
export async function getConnection(){const value=(await load()).connection;return value ? {...value, secret: value.secret ? decryptSecret(value.secret) : undefined} : undefined;}
export async function saveConnection(input: Omit<Connection,'secretHint'> & { secret?: string }) { const connection: Connection = {...input, secret: input.secret ? encryptSecret(input.secret) : undefined, secretHint: input.secret ? `••••${input.secret.slice(-4)}` : undefined}; const db=await load(); await save({...db,connection}); return {...connection,secret:undefined}; }

export async function executeRun(input: { endpoint: string; version: string; baseline?: string; caseIds?: string[] }) {
  const db = await load();
  const connection = db.connection;
  const selected = db.cases.filter(item => !input.caseIds?.length || input.caseIds.includes(item.id));
  const id = `run-${Date.now()}`;
  const cases: Case[] = [];
  for (const item of selected) {
    const started = Date.now();
    let actual: unknown = null;
    let status: Case['status'] = 'failed';
    let trace = ['agent.run', 'execution.error'];
    try {
      const headers: Record<string,string> = { 'content-type': 'application/json' }; if(connection?.secret){const secret=decryptSecret(connection.secret); headers[connection.authType==='bearer'?'authorization':'x-api-key']=connection.authType==='bearer'?`Bearer ${secret}`:secret;}
      const response = await fetch(input.endpoint, { method: 'POST', headers, body: JSON.stringify({ version: input.version, input: item.input }), signal: AbortSignal.timeout(5000), redirect: 'error' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text(); if (text.length > 256 * 1024) throw new Error('response too large');
      const payload = JSON.parse(text) as { output?: unknown; trace?: string[] };
      actual = payload.output;
      trace = payload.trace ?? ['agent.run', 'model.call'];
      const result: EvalResult = evaluate({ type: item.id === 'case-07' ? 'contains' : item.id === 'case-08' ? 'required_json_paths' : 'exact_match', expected: item.expected, actual, config: item.id === 'case-08' ? { paths: ['valid'] } : undefined, latencyMs: Date.now() - started });
      status = result.passed ? 'passed' : 'failed';
    } catch { actual = { error: 'endpoint execution failed' }; }
    cases.push({ ...item, actual, status, latency: Date.now() - started, trace });
  }
  const run: Run = { id, version: input.version, baseline: input.baseline, status: 'completed', createdAt: new Date().toISOString(), cases };
  await save({ ...db, runs: [run, ...db.runs] });
  return run;
}