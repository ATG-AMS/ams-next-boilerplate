import { NextResponse } from 'next/server';
import { makeData } from '@/lib/makeData';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const amount = Number(url.searchParams.get('amount')) || 5;

  const users = makeData(amount).map((u, idx) => ({
    ...u,
    idx: idx + 1,
    createdAt: new Date().toISOString(),
  }));

  return NextResponse.json({ rows: users, count: users.length });
}

