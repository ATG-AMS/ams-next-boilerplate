// src/app/api/users/create/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { userSchema } from '@/app/user/_libs/userSchema';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parse = userSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.format() }, { status: 400 });
  }

  const { name, email, age } = parse.data;

  const isDuplicate = await prisma.user.findUnique({
    where: { email },
  });

  if (isDuplicate) {
    return NextResponse.json({ error: { email: '이미 등록된 이메일입니다.' } }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      age,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
