import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

const jsonResponse = (data: any, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return jsonResponse({ isAvailable: false });
    }

    return jsonResponse({ isAvailable: true });
  } catch (error) {
    return jsonResponse({ error: '서버 오류' }, 500);
  }
}
