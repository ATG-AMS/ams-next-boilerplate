/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// JSON 형식으로 응답하는 도우미 함수
const jsonResponse = (data: any, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// 유저 목록을 가져오는 GET 함수
export async function GET(request: Request) {
  // URL에서 쿼리 파라미터 추출
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");
  const sort = url.searchParams.get("sort");
  const order = url.searchParams.get("order");
  const filter = url.searchParams.get("filter");

  try {
    // Prisma를 사용해 데이터베이스에서 유저 정보를 조회
    const users = await prisma.user.findMany({
      skip: page && limit ? Number(page) * Number(limit) : undefined,
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
    return jsonResponse({ rows: [...users], count });
  } catch (error: unknown) {
    return jsonResponse({ error: (error as Error).message }, 500);
  }
}

// 유저를 추가하는 POST 함수
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const user = await prisma.user.create({ data: json });
    // return jsonResponse(user, 201);
    return new NextResponse(JSON.stringify({
        success: true,
        data:user
      }));
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // return jsonResponse("User with email already exists", 409);
        return new NextResponse(JSON.stringify({
          success: false,
          data:{
            code: error.code,
            message: "중복된 email입니다",// error.message,
            meta: error.meta,
          },
          headers: { 'Content-Type': 'application/json' }
        }));
      }
    }
    return jsonResponse({ error: (error as Error).message }, 500);
  }
}

// 유저 정보를 수정하는 PUT 함수
export async function PUT(request: Request) {
  try {
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
    return jsonResponse(user);
  } catch (error: unknown) {
    return jsonResponse({ error: (error as Error).message }, 500);
  }
}

// 유저를 삭제하는 DELETE 함수
export async function DELETE(request: Request) {
  try {
    const { idx } = JSON.parse(await request.text());
    if (idx === "reset-data") {
      await prisma.user.deleteMany({});
      return jsonResponse({});
    } else if (idx) {
      await prisma.user.delete({ where: { idx: Number(idx) } });
      return jsonResponse({});
    }
  } catch (error: unknown) {
    return jsonResponse({ error: (error as Error).message }, 500);
  }
}
