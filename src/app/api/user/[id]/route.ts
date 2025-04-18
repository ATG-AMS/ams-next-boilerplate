// src/app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { makeData } from "@/lib/makeData";

const users = makeData(50); // 유저 50명 생성

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const idx = Number(id);

  if (Number.isNaN(idx) || idx < 0 || idx >= users.length) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(users[idx]);
}
