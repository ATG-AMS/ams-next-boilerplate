"use client"; // React Client 컴포넌트 임을 명시

import type { User } from "@prisma/client"; // Prisma에서 제공하는 User 모델
import type { ColumnDef } from "@tanstack/react-table"; // @tanstack/react-table 라이브러리에서 제공하는 ColumnDef 타입
import type { ReactNode } from "react"; // React의 기본 타입인 ReactNode 타입
import ModifyDialog from "./ModifyDialog"; // 사용자 정보 수정 다이얼로그 컴포넌트
import {DeleteButton} from "./DeleteButton"; // 사용자 삭제 기능 버튼 컴포넌트
// 테이블의 기본 컬럼 정의
export const defaultColumn: Array<ColumnDef<User>> = [
  {
    accessorKey: "idx",
    header: "순번",
    cell: (cell) => (
      <p className="text-center">
        {(cell.getValue() as number)?.toLocaleString("ko-KR")}
      </p>
    ),
  },
  {
    accessorKey: "name",
    header: "이름",
    cell: (cell) => (
      <p className="text-center">{cell.getValue() as ReactNode}</p>
    ),
  },
  { accessorKey: "email", header: "이메일" },
  {
    accessorKey: "age",
    header: "나이",
    cell: (cell) => (
      <p className="text-right">{cell.getValue() as ReactNode}</p>
    ),
  },
  {
    accessorKey: "visits",
    header: "방문횟수",

    cell: (cell) => (
      <p className="text-right">{cell.getValue() as ReactNode}번</p>
    ),
  },
  {
    accessorKey: "progress",
    header: "진행률",

    cell: (cell) => (
      <p className="text-right">{cell.getValue() as ReactNode}%</p>
    ),
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: (cell) => (
      <p className="text-center">{cell.getValue() as ReactNode}</p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "생성 시각",
    // cell에서는 해당 데이터를 가져와서 시간 형태로 보여줌
    cell: (cell) => (
      <p className="text-center">
        {getTimeFromDate(cell.getValue() as string)}
      </p>
    ),
  },
  {
    // 수정 버튼에 대한 컬럼
    header: "수정",
    // 각 행에 대한 사용자 정보를 ModifyDialog 컴포넌트에 전달
    cell: (cell) => (
      <div className="text-center">
        <ModifyDialog user={cell.row.original} />
      </div>
    ),
  },
  {
    // 수정 버튼에 대한 컬럼
    header: "삭제",
    // 각 행에 대한 사용자 정보를 ModifyDialog 컴포넌트에 전달
    cell: (cell) => (
      <div className="text-center">
        <DeleteButton user={cell.row.original} />
      </div>
    ),
  },
];

// 주어진 날짜의 시간 부분을 한국 시간으로 반환하는 함수
function getTimeFromDate(date: string | Date) {
  if (typeof date === "string") {
    date = new Date(date); // 문자열을 Date 객체로 변환
  }
  return date.toLocaleTimeString("ko-KR"); // 한국 시간으로 시간 부분만 반환
}
