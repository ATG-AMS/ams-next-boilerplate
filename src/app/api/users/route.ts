import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * JSON 응답 객체를 생성하는 유틸 함수
 *
 * @param data - 응답할 데이터 객체
 * @param status - HTTP 상태 코드 (기본값: 200)
 * @returns JSON 형식의 NextResponse 객체
 */
const jsonResponse = (data: any, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/**
 * 엔드포인트 [`/api/users`]
 *
 * 사용자 목록을 조회하는 GET 메서드
 *
 * URL 매개변수로 필터링, 정렬, 페이징을 지원함.
 *
 * @param request - HTTP 요청 객체
 * @returns 사용자 목록과 총 개수를 포함한 JSON 응답
 */
export async function GET(request: Request) {
  /* 
  [`/api/users?page=0&limit=10&sort=idx&order=desc&email=hotmail.com` 에 대한 GET 요청 예시]
  {
    "rows": [
      {
        "idx": 324,
        "name": "Haylee",
        "email": "Hulda.Balistreri@hotmail.com",
        "age": 9,
        "visits": 169,
        "progress": 29,
        "status": "single",
        "createdAt": "2025-04-16T02:24:00.039Z"
      },
      {
        "idx": 321,
        "name": "Cordelia",
        "email": "Domenica.Runolfsson@hotmail.com",
        "age": 30,
        "visits": 924,
        "progress": 83,
        "status": "single",
        "createdAt": "2025-04-16T02:23:59.861Z"
      }
    ],
    "count": 97
  }
  */
  // #1. URL 매개변수 추출
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const limit = url.searchParams.get('limit');
  const sort = url.searchParams.get('sort');
  const order = url.searchParams.get('order');
  const email = url.searchParams.get('email');
  const name = url.searchParams.get('name');
  const age = url.searchParams.get('age');

  try {
    // #2. 사용자 목록 조회
    const users = await prisma.user.findMany({
      skip: page && limit ? Number(page) * Number(limit) : undefined,
      take: limit ? Number(limit) : undefined,
      orderBy: sort ? { [sort]: order || 'asc' } : undefined,
      where: {
        ...(email && {
          email: {
            contains: email,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }),
        ...(name && {
          name: { contains: name, mode: 'insensitive' } as Prisma.StringFilter,
        }),
        ...(age && { age: Number(age) }),
      },
    });

    // #3. 필터된 전체 사용자 수 조회
    const count = await prisma.user.count({
      where: {
        ...(email && {
          email: {
            contains: email,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }),
        ...(name && {
          name: { contains: name, mode: 'insensitive' } as Prisma.StringFilter,
        }),
        ...(age && { age: Number(age) }),
      },
    });

    return jsonResponse({ rows: [...users], count });
  } catch (error: unknown) {
    return jsonResponse({ error: (error as Error).message }, 500);
  }
}

/**
 * 새로운 사용자를 추가하는 POST 메서드
 *
 * @param request - HTTP 요청 객체 (JSON 본문 포함)
 * @returns 생성된 사용자 정보 또는 에러 메시지
 */
export async function POST(request: Request) {
  try {
    const json = await request.json();

    const user = await prisma.user.create({ data: json });

    return jsonResponse(user, 201);
  } catch (error: unknown) {
    // 고유 키 충돌 처리
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return jsonResponse(
          '이미 해당 이메일로 등록된 사용자가 존재합니다',
          409
        );
      }
    }

    return jsonResponse({ error: (error as Error).message }, 500);
  }
}

/**
 * 기존 사용자 정보를 수정하는 PUT 메서드
 *
 * @param request - HTTP 요청 객체 (JSON 본문 포함)
 * @returns 수정된 사용자 정보 또는 에러 메시지
 */
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

/**
 * 사용자를 삭제하거나 모든 데이터를 리셋하는 DELETE 메서드
 *
 * @param request - HTTP 요청 객체 (본문에 idx 포함)
 * @returns 삭제 결과 또는 에러 메시지
 */
export async function DELETE(request: Request) {
  try {
    const { idx } = JSON.parse(await request.text());

    // #1. 전체 초기화 처리
    if (idx === 'reset-data') {
      await prisma.user.deleteMany({});
      return jsonResponse({});
    }

    // #2. 단일 유저 삭제 처리
    if (idx) {
      await prisma.user.delete({ where: { idx: Number(idx) } });
      return jsonResponse({});
    }
  } catch (error: unknown) {
    return jsonResponse({ error: (error as Error).message }, 500);
  }
}
