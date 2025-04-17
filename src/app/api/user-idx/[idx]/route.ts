import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * JSON 응답을 생성하는 도우미 함수.
 *
 * @param data - 응답에 포함될 데이터
 * @param status - HTTP 상태 코드 (기본값: 200)
 * @returns `NextResponse` 객체
 */
const jsonResponse = (data: any, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/**
 * [엔드포인트 `/api/user-idx/[idx]`]
 *
 * 특정 유저 정보를 조회하는 GET 메서드.
 *
 * @param request - 요청 객체 (단, 코드 내부에서는 사용되지 않음)
 * @param params - `id` URL 파라미터를 포함한 객체 (필수)
 * @returns 유저 객체 또는 에러 메시지 포함 JSON 응답 반환
 *
 * @example
 * async function fetchUser(idx) {
 *   try {
 *     const response = await fetch(`/api/user/${idx}`);
 *     if (!response.ok) {
 *       if (response.status === 404) {
 *         alert("해당 사용자를 찾을 수 없습니다."); // HTTP 404 처리
 *       } else if (response.status === 500) {
 *         alert("서버 오류가 발생했습니다. 관리자에게 문의해주세요."); // HTTP 500 처리
 *       } else {
 *         alert(`오류가 발생했습니다: ${response.statusText}`);
 *       }
 *       return;
 *     }
 *     const user = await response.json();
 *     console.log("사용자 정보를 잘 받아왔습니다:", user);
 *   } catch (error) {
 *     console.error("Error fetching user:", error);
 *     alert("서버와 통신 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { idx: number } }
) {
  try {
    // #1. URL 매개변수에서 유저 인덱스값(`idx`) 추출
    /*
     * [Playground Note]
     * app 디렉터리에서 `[idx]`라는 폴더명을 사용했는데, 이 부분이 동적 라우팅을 의미합니다.
     * 예를 들어, `/api/user/3`로 요청이 들어오면 `params.idx`는 "3"이 됩니다.
     * 지금은 예시 프로젝트이므로 누구나 접근할 수 있지만, 차후 실 배포 환경에서는 인증을 통해 보안을 강화해야 합니다.
     * 이 값을 숫자로 변환하여 DB에서 유저 정보를 조회합니다.
     * 물론 실사용 측면에서는 사용자가 `idx` 값을 이용하기 힘드므로, `email`이나 `username`을 사용하는 것이 바람직합니다.
     * 관련하여, [...props] 와 같이 폴더명을 변경하여 여러 개의 매개변수를 받을수도 있지만,
     * 이렇게 되면 개발적인 측면에서 다루기 어려우므로 추천하지 않습니다. (예: `/api/user/3/홍길동` → `params.idx`는 ["3", "홍길동"]이 됨)
     * [동적 라우팅 공식 문서](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes)를 참조해보세요.
     */
    const userId = Number(params.idx);

    // #2. Prisma를 통해 유저 정보 조회
    const user = await prisma.user.findUnique({
      where: { idx: userId },
    });

    // #3. 유저가 존재하지 않는 경우 HTTP 404 Not Found 반환
    if (!user) {
      return jsonResponse({ error: '해당 사용자를 찾을 수 없습니다.' }, 404);
    }

    // #4. 유저 정보 반환
    return jsonResponse(user);
  } catch (error: unknown) {
    // #5. 예외 발생 시 HTTP 500 Internal Server Error 반환
    return jsonResponse(
      { error: `서버 오류가 발생했습니다: ${(error as Error).message}` },
      500
    );
  }
}

/**
 * [엔드포인트 `/api/user-idx/[idx]`]
 * 특정 유저 정보 일부를 수정하는 PATCH 메서드.
 *
 * @param request - 요청 객체 (body에 수정할 데이터 포함)
 * @param params - `id` URL 파라미터를 포함한 객체 (필수)
 * @returns 수정된 유저 객체 또는 에러 메시지 포함 JSON 응답 반환
 *
 * @example
 * async function updateUser(idx, updateData) {
 *   try {
 *     const response = await fetch(`/api/user/${idx}`, {
 *       method: "PATCH",
 *       headers: {
 *         "Content-Type": "application/json",
 *       },
 *       body: JSON.stringify(updateData),
 *     });
 *     if (!response.ok) {
 *       if (response.status === 404) {
 *         alert("해당 사용자를 찾을 수 없습니다."); // HTTP 404 처리
 *       } else if (response.status === 500) {
 *         alert("서버 오류가 발생했습니다. 관리자에게 문의해주세요."); // HTTP 500 처리
 *       } else {
 *         alert(`오류가 발생했습니다: ${response.statusText}`);
 *       }
 *       return;
 *     }
 *     const updatedUser = await response.json();
 *     console.log("사용자 정보가 성공적으로 수정되었습니다:", updatedUser);
 *   } catch (error) {
 *     console.error("Error updating user:", error);
 *     alert("서버와 통신 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
 *   }
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { idx: string } }
) {
  try {
    // #1. URL 매개변수에서 유저 인덱스값(`idx`) 추출
    const userId = Number(params.idx);

    // #2. 요청 바디에서 JSON 파싱
    const updateData = await request.json();

    // #3. 해당 유저에 대해 필드 일부만 수정
    const updatedUser = await prisma.user.update({
      where: { idx: userId },
      data: {
        ...updateData,
      },
    });

    // #4. 수정된 유저 정보 반환
    return jsonResponse(updatedUser);
  } catch (error: unknown) {
    // #5. 유저가 존재하지 않을 경우 (Prisma 에러 코드 P2025)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return jsonResponse({ error: 'User not found' }, 404);
    }

    // #6. 기타 예외 처리
    return jsonResponse({ error: (error as Error).message }, 500);
  }
}
