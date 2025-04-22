'use client';

import type { ReactNode } from 'react';
import type { User, UsersResponse } from '../_interface/users-interface';
import type { User as PrismaUser } from '@prisma/client';
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import ModifyDialog from '../_component/user-modify';
import { UserDeleteButton } from '../_component/user-delete';

function getTimeFromDate(date: string | Date | undefined): string {
  if (!date) return ''; // date가 undefined인 경우 빈 문자열 반환
  if (typeof date === 'string') {
    date = new Date(date); // 문자열을 Date 객체로 변환
  }
  return date.toLocaleTimeString('ko-KR'); // 한국 시간으로 시간 부분만 반환
}

const UserManageColumnHelper = createColumnHelper<User>();

export const UserManageTableColumn = [
  UserManageColumnHelper.accessor('idx', {
    header: () => <p className="text-center">순번</p>,
    cell: (cell) => (
      <p className="text-center">
        {(cell.getValue() as number)?.toLocaleString('ko-KR')}
      </p>
    ),
    size: 50,
  }),
  UserManageColumnHelper.accessor('name', {
    header: () => <p className="text-center">이름</p>,
    cell: (cell) => <p className="text-center">{cell.getValue() as string}</p>,
    size: 200,
  }),
  UserManageColumnHelper.accessor('email', {
    header: () => <p className="text-center">이메일</p>,
    size: 200,
  }),
  UserManageColumnHelper.accessor('age', {
    header: () => <p className="text-center">나이</p>,
    cell: (cell) => (
      <p className="text-right">{cell.getValue() as ReactNode}세</p>
    ),
    size: 50,
  }),
  UserManageColumnHelper.accessor('visits', {
    header: () => <p className="text-center">방문횟수</p>,
    cell: (cell) => (
      <p className="text-right">{cell.getValue() as ReactNode}번</p>
    ),
    size: 100,
  }),
  UserManageColumnHelper.accessor('progress', {
    header: () => <p className="text-center">진행률</p>,
    cell: (cell) => (
      <p className="text-right">{cell.getValue() as ReactNode}%</p>
    ),
    size: 50,
  }),
  UserManageColumnHelper.accessor('status', {
    header: () => <p className="text-center">상태</p>,
    cell: (cell) => (
      <p className="text-center">{cell.getValue() as ReactNode}</p>
    ),
    size: 100,
  }),
  UserManageColumnHelper.accessor('createdAt', {
    header: () => <p className="text-center">생성 시각</p>,
    cell: (cell) => (
      <p className="text-center">{getTimeFromDate(cell.getValue())}</p>
    ),
    size: 150,
  }),
  UserManageColumnHelper.display({
    id: 'modify',
    header: () => <p className="text-center">수정</p>,
    cell: (cell) => (
      <p className="flex justify-center">
        <ModifyDialog user={cell.row.original as PrismaUser} />
      </p>
    ),
    size: 50,
  }),
  UserManageColumnHelper.display({
    id: 'delete',
    header: () => <p className="text-center">삭제</p>,
    cell: (cell) => (
      <p className="flex justify-center">
        <UserDeleteButton user={cell.row.original as PrismaUser} />
      </p>
    ),
    size: 50,
  }),
];

export const UserManageTable = (
  data: UsersResponse | undefined,
  pageIndex: number,
  pageSize: number,
  setPageIndex: (pageIndex: number) => void,
  setPageSize: (pageSize: number) => void
) =>
  useReactTable({
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
      const newPagination =
        typeof updater === 'function'
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

export default UserManageTable;
