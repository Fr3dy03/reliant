import { NextResponse } from 'next/server';
import { executeRun, listRuns, getConnection } from '../../../../../lib/runtime';
import { requireRole, canReadProject, canWriteProject } from '../../../../../lib/authorization';
export async function POST(request: Request) {
  const projectId=new URL(request.url).pathname.split('/')[3];const auth=requireRole('engineer');if(!auth.ok||!canWriteProject(projectId))return NextResponse.json({error:auth.ok?'Project access denied':auth.error},{status:auth.ok?403:auth.status});
  const body = await request.json().catch(() => ({})) as { endpoint?: string; version?: string; baseline?: string; caseIds?: string[] };
  const connection = await getConnection();
  const run = await executeRun({ endpoint: body.endpoint ?? connection?.endpoint ?? new URL('/api/fixture', request.url).toString(), version: body.version ?? connection?.version ?? 'research-agent@1.1.0', baseline: body.baseline, caseIds: body.caseIds });
  return NextResponse.json({ status: 'completed', run });
}
export async function GET(request:Request) { const projectId=new URL(request.url).pathname.split('/')[3];const auth=requireRole('viewer');if(!auth.ok||!canReadProject(projectId))return NextResponse.json({error:auth.ok?'Project access denied':auth.error},{status:auth.ok?403:auth.status});return NextResponse.json({ runs: (await listRuns()).map(({ id, version, status, createdAt, baseline }) => ({ id, version, status, createdAt, baseline })) }); }
