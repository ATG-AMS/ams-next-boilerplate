import { NextResponse } from "next/server";

const jsonResponse = (data: any, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

  export type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    phone: string;
    birthDate: string;
  };

  // export const Users = null;
  export const Users = [
    { id: 1, name: "홍세란", email: "sr@example.com", age: 30, phone: "010-1234-5678", birthDate: "1993-05-14" },
    { id: 2, name: "소병학", email: "bh@example.com", age: 30, phone: "010-2345-6789", birthDate: "1992-11-03" },
    { id: 3, name: "황석현", email: "sh@example.com", age: 25, phone: "010-3456-7890", birthDate: "1998-08-22" },
    { id: 4, name: "최승우", email: "csw@example.com", age: 29, phone: "010-4567-8901", birthDate: "1994-01-19" },
    { id: 5, name: "김윤희", email: "kyh@example.com", age: 27, phone: "010-5678-9012", birthDate: "1996-03-30" },
    { id: 6, name: "김연호", email: "kyh2@example.com", age: 28, phone: "010-6789-0123", birthDate: "1995-07-10" },
    { id: 7, name: "임재범", email: "ljb@example.com", age: 34, phone: "010-7890-1234", birthDate: "1989-12-08" },
    { id: 8, name: "강영진", email: "kyj@example.com", age: 26, phone: "010-8901-2345", birthDate: "1997-06-15" },
    { id: 9, name: "정재호", email: "jjh@example.com", age: 31, phone: "010-9012-3456", birthDate: "1992-02-25" },
    { id: 10, name: "김주헌", email: "kjh@example.com", age: 32, phone: "010-0123-4567", birthDate: "1991-09-17" },
    { id: 11, name: "김영석", email: "kys@example.com", age: 33, phone: "010-1357-2468", birthDate: "1990-04-12" },
    { id: 12, name: "이승현", email: "lsh@example.com", age: 30, phone: "010-2468-1357", birthDate: "1993-10-01" },
  ];

export async function GET() {
  return jsonResponse(Users);
}


