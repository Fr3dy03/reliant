import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const body = await request.json() as { version?: string; input?: { question?: string } };
  const question = body.input?.question ?? '';
  const regression = body.version?.includes('1.1.0') && (question.includes('capital') || question.includes('refund'));
  let output: unknown = 'Fixture answer';
  if (question.includes('capital')) output = regression ? 'London' : 'Paris';
  else if (question.includes('support')) output = { category: 'support' };
  else if (question.includes('valid JSON')) output = { valid: true };
  else if (question.includes('No data')) output = 'No data';
  else if (question.includes('refund')) output = regression ? '30 days' : '14 days';
  return NextResponse.json({ output, trace: ['agent.run', 'model.call'] });
}