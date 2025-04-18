// import { NextResponse } from "next/server";

// // export async function GET(request:Request){
// //     return NextResponse.json({start:"ayo"})
// // }
// export async function GET(request: Request) {
//     const users = [
//       { name: "소병학", age: 29 },
//       { name: "홍길동", age: 32 },
//     ];
  
//     return new NextResponse(JSON.stringify({ rows: users, count: users.length }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//     // return NextResponse.json(JSON.stringify(users));
//   }

import { NextResponse } from 'next/server';
import { makeData } from '@/lib/makeData';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const amount = Number(url.searchParams.get('amount')) || 5;

  const users = makeData(amount).map((u, idx) => ({
    ...u,
    idx: idx + 1,
    createdAt: new Date().toISOString(),
  }));

  return NextResponse.json({ rows: users, count: users.length });
}

