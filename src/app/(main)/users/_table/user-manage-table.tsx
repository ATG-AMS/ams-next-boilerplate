'use client';

import type { ReactNode } from 'react';
import type { User } from "@prisma/client";
import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef} from '@tanstack/react-table';
import ModifyDialog from '../_utils/ModifyDialog';

interface UsersResponse {
  rows: User[];
  count: number;
}

function getTimeFromDate(date: string | Date) {
  if (typeof date === "string") {
    date = new Date(date); // 문자열을 Date 객체로 변환
  }
  return date.toLocaleTimeString("ko-KR"); // 한국 시간으로 시간 부분만 반환
}

const UserManageColumnHelper = createColumnHelper<User>();

export const UserManageTableColumn = [
  UserManageColumnHelper.accessor("idx", {
    header: "순번",
    cell: (cell) => (
      <p className="text-center">
        {(cell.getValue() as number)?.toLocaleString("ko-KR")}
      </p>
    ),
  }),
  UserManageColumnHelper.accessor("name", {
    header: "이름",
    cell: (cell) => (
      <p className="text-center">{cell.getValue() as ReactNode}</p>
    ),
  }),
  UserManageColumnHelper.accessor("email", {
    header: "이메일",
  }),
  UserManageColumnHelper.accessor("age", {
    header: "나이",
    cell: (cell) => (
      <p className="text-right">{cell.getValue() as ReactNode}</p>
    ),
  }),
  UserManageColumnHelper.accessor("visits", {
    header: "방문횟수",
    cell: (cell) => (
      <p className="text-right">{cell.getValue() as ReactNode}번</p>
    ),
  }),
  UserManageColumnHelper.accessor("progress", {
    header: "진행률",
    cell: (cell) => (
      <p className="text-right">{cell.getValue() as ReactNode}%</p>
    ),
  }),
  UserManageColumnHelper.accessor("status", {
    header: "상태",
    cell: (cell) => (
      <p className="text-center">{cell.getValue() as ReactNode}</p>
    ),
  }),
  UserManageColumnHelper.accessor("createdAt", {
    header: "생성 시각",
    cell: (cell) => (
      <p className="text-center">
        {getTimeFromDate(cell.getValue())}
      </p>
    ),
  }),
  UserManageColumnHelper.display({
    header: "수정",
    cell: (cell) => (
      <div className="text-center">
        <ModifyDialog user={cell.row.original} />
      </div>
    ),
  }),
];

export const UserManageTable = (
  data: UsersResponse | undefined,
  pageIndex: number,
  pageSize: number,
  setPageIndex: (pageIndex: number) => void,
  setPageSize: (pageSize: number) => void,
) => useReactTable({
  data: data?.rows || [],
  columns: UserManageTableColumn,
  pageCount: Math.ceil((data?.count || 0) / pageSize),
  state: {
    pagination: {
      pageIndex,
      pageSize,
    },
  },
  onPaginationChange: (updater) => {
    const newPagination = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
    setPageIndex(newPagination.pageIndex);
    setPageSize(newPagination.pageSize);
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  manualPagination: true,
});

export default UserManageTable