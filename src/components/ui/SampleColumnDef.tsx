"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import ModifyDialog from "./ModifyDialog";

export const defaultColumn: ColumnDef<User>[] = [
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
    cell: (cell) => (
      <p className="text-center">
        {getTimeFromDate(cell.getValue() as string)}
      </p>
    ),
  },
  {
    header: "수정",
    cell: (cell) => <ModifyDialog user={cell.row.original} />,
  },
];

function getTimeFromDate(date: string | Date) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleTimeString("ko-KR");
}
