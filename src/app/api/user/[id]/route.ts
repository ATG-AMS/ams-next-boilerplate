// src/app/api/user/[id]/route.ts
// import { NextResponse } from "next/server";
// import { makeData } from "@/lib/makeData";

// const users = makeData(50); // 유저 50명 생성

// export async function GET(
//   request: Request,
//   context: { params: { id: string } }
// ) {
//   const { id } = context.params;
//   const idx = Number(id);

//   if (Number.isNaN(idx) || idx < 0 || idx >= users.length) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   return NextResponse.json(users[idx]);
// }

// src/app/api/user/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { idx: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
