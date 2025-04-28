import { NextResponse } from "next/server";
import { Users } from "../../user/route";

const jsonResponse = (data: any, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function GET(
  request: Request, //쓰지 않더라도 지우면 X -> Next(13이상)가 내부적으로 부르는 함수기 때문에 매개변수 순서!지키기
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const user = Users.find((u) => u.id === id);

  if (!user) {
    return jsonResponse({ message: "유저를 찾을 수 없습니다." }, 404);
  }

  return jsonResponse(user);
}