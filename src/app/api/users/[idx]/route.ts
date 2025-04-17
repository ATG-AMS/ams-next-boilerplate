//src/app/api/users/[idx]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  // request: Request,
  _: Request,
  { params }: { params: { idx: string } }
) {
  const idx = Number(params.idx);

  if (isNaN(idx)) {
    return new NextResponse(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { idx: idx },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
