import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/runtime';
import { validateEndpoint } from '../../../lib/security';
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { endpoint?: string };
  const connection = await getConnection();
  const endpoint = body.endpoint ?? connection?.endpoint ?? new URL('/api/fixture', request.url).toString();
  try {
    if (!endpoint.includes('/api/fixture')) validateEndpoint(endpoint, true);
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (connection?.secret) { headers[connection.authType === 'bearer' ? 'authorization' : 'x-api-key'] = connection.authType === 'bearer' ? `Bearer ${connection.secret}` : connection.secret; }
    const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ version: connection?.version ?? 'research-agent@1.0.0', input: { question: 'What is the capital of France?' } }), signal: AbortSignal.timeout(3000), redirect: 'error' });
    if (!response.ok) return NextResponse.json({ ok: false, error: `HTTP ${response.status}` }, { status: 502 });
    const text = await response.text();
    if (text.length > 256 * 1024) return NextResponse.json({ ok: false, error: 'Response exceeded 256KB limit' }, { status: 502 });
    const data = JSON.parse(text) as { output?: unknown; trace?: string[] };
    return NextResponse.json({ ok: true, status: response.status, sampleOutput: data.output, trace: data.trace });
  } catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Connection failed' }, { status: 502 }); }
}