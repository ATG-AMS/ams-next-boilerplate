import { NextResponse } from "next/server";

// export async function GET(request:Request){
//     return NextResponse.json({start:"ayo"})
// }
export async function GET(request: Request) {
    const users = [
      { name: "소병학", age: 29 },
      { name: "홍길동", age: 32 },
    ];
  
    return new NextResponse(JSON.stringify({ rows: users, count: users.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    // return NextResponse.json(JSON.stringify(users));
  }