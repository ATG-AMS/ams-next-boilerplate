import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");
  const sort = url.searchParams.get("sort");
  const order = url.searchParams.get("order");
  const filter = url.searchParams.get("filter");

  const users = await prisma.user.findMany({
    skip: page ? Number(page) * Number(limit) : undefined,
    take: limit ? Number(limit) : undefined,
    orderBy: sort ? { [sort]: order || "asc" } : undefined,
    where: filter
      ? ({
          OR: [
            { name: { contains: filter } },
            { email: { contains: filter } },
            { age: { equals: Number(filter) } },
          ],
        } as Prisma.UserWhereInput)
      : undefined,
  });

  const count = await prisma.user.count();

  return new NextResponse(JSON.stringify({ rows: [...users], count }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const user = await prisma.user.create({
      data: json,
    });

    return new NextResponse(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse("User with email already exists", {
        status: 409,
      });
    }
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function PUT(request: Request) {
  console.log("🚀 ~ file: route.ts:59 ~ PUT ~ request:", request);
  const json = await request.json();
  const { idx, email, age, visits, progress } = json;

  const user = await prisma.user.update({
    where: { idx: Number(idx) },
    data: {
      email,
      age: Number(age),
      visits: Number(visits),
      progress: Number(progress),
    },
  });

  return new NextResponse(JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: Request) {
  const { idx } = JSON.parse(await request.text());

  if (idx === "reset-data") {
    await prisma.user.deleteMany({});
    return new NextResponse(JSON.stringify({}), {
      headers: { "Content-Type": "application/json" },
    });
  } else if (idx) {
    await prisma.user.delete({
      where: { idx: Number(idx) },
    });
    return new NextResponse(JSON.stringify({}), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
