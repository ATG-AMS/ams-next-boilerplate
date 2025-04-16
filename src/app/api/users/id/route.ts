import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const user = await prisma.user.findUnique({
      where: { idx: Number(id) },
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
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
