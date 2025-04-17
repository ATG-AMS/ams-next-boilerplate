import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * JSON 응답을 생성하는 도우미 함수.
 *
 * @param data - 응답에 포함할 데이터
 * @param status - HTTP 상태 코드 (기본값: 200)
 * @returns `NextResponse` 객체
 */
const jsonResponse = (data: unknown, status = 200): NextResponse =>
  NextResponse.json(data, { status });

/**
 * [엔드포인트 `/api/user`]
 *
 * 이메일을 기반으로 유저 정보를 조회하는 GET 메서드.
 *
 * @param request - 요청 객체 (`email` URL 매개변수 포함)
 * @returns 유저 객체 또는 에러 메시지 포함 JSON 응답 반환
 *
 * @example
 * GET /api/user?email=test@example.com
 */
export async function GET(request: NextRequest) {
  try {
    // #1. URL 매개변수에서 email 추출
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // #2. 이메일 필수 유효성 검사
    if (!email) {
      return jsonResponse(
        { error: 'URL 매개변수로 email 값이 필요합니다.' },
        400
      );
    }

    // #3. Prisma를 이용해 해당 이메일의 유저 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // #4. 유저 존재 여부 확인
    if (!user) {
      return jsonResponse({ error: '해당 사용자를 찾을 수 없습니다.' }, 404);
    }

    // #5. 유저 정보 반환
    return jsonResponse(user);
  } catch (error: unknown) {
    // #6. 예외 처리 (서버 내부 오류)
    return jsonResponse(
      { error: `서버 오류가 발생했습니다: ${(error as Error).message}` },
      500
    );
  }
}

/**
 * [엔드포인트 `/api/user`]
 *
 * 특정 유저 정보를 전체 또는 일부 수정하는 PUT 또는 PATCH 메서드.
 * `idx` URL 매개변수를 통해 대상 유저를 지정해야 함.
 *
 * @param request - 요청 객체 (body에 수정할 데이터 포함)
 * @returns 수정된 유저 객체 또는 에러 메시지 포함 JSON 응답 반환
 *
 * @example
 * PUT /api/user?idx=3
 * PATCH /api/user?idx=3
 */
export async function PUT(request: NextRequest) {
  return handleUpdate(request);
}

export async function PATCH(request: NextRequest) {
  return handleUpdate(request);
}

/**
 * 유저 정보를 업데이트하는 공통 처리 함수 (PUT, PATCH에서 호출).
 *
 * @param request - 요청 객체
 * @returns 응답 객체
 */
async function handleUpdate(request: NextRequest) {
  try {
    // #1. URL 매개변수에서 idx 추출 및 숫자 변환
    const { searchParams } = new URL(request.url);
    const idx = Number(searchParams.get('idx'));

    // #2. idx 유효성 검사
    if (!idx || isNaN(idx)) {
      return jsonResponse({ error: '유효한 idx 값이 필요합니다.' }, 400);
    }

    // #3. 요청 body에서 JSON 파싱
    const updateData = await request.json();

    // #4. Prisma를 이용해 해당 유저 정보 업데이트
    const updatedUser = await prisma.user.update({
      where: { idx },
      data: {
        ...updateData,
      },
    });

    // #5. 업데이트된 유저 정보 반환
    return jsonResponse(updatedUser);
  } catch (error: unknown) {
    // #6. 유저가 존재하지 않을 경우 (Prisma 오류 코드: P2025)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return jsonResponse({ error: '해당 사용자를 찾을 수 없습니다.' }, 404);
    }

    // #7. 기타 예외 처리
    return jsonResponse({ error: (error as Error).message }, 500);
  }
}
