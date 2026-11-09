import { NextResponse } from 'next/server';
import { appendCases } from '../../../../../../lib/runtime';
export async function POST(request: Request) {
  const body = await request.json() as { jsonl?: string };
  const rows = (body.jsonl ?? '').split(/\r?\n/).filter(Boolean).map((line, index) => { try { const value = JSON.parse(line); return { id: value.id ?? `import-${index + 1}`, title: value.title ?? `Imported case ${index + 1}`, input: value.input, expected: value.expected, status: 'failed', latency: 0, actual: null, trace: [] }; } catch { return null; } }).filter(Boolean);
  if (!rows.length) return NextResponse.json({ error: 'No valid JSONL rows' }, { status: 400 });
  return NextResponse.json({ imported: await appendCases(rows as never[]) });
}