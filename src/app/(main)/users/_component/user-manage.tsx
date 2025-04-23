'use client';

import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import type { User } from '../_interface/users-interface';
import { useUsersQuery, useCreateUser } from '../_action/users-data-query';
import { UserManageTable } from '../_table/users-table';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { CreateUserDialog } from './user-create';
import { Label } from '@/components/atoms/Label';

/**
 * 사용자 목록 페이지 컴포넌트
 *
 * - 사용자 목록 조회 및 검색 기능 제공
 * - 사용자 추가 대화 상자(Dlalog) 제공
 * - 서버사이드 페이지네이션 포함
 */
export const UserManagePage = () => {
  // #1. 상태 정의
  const [pageSize, setPageSize] = useState(15);
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState({ name: '', email: '' });
  const [filterParams, setFilterParams] = useState({ name: '', email: '' });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // #2. 사용자 데이터 Fetch
  const { data, isLoading, isError } = useUsersQuery({
    sort: 'idx',
    order: 'desc',
    page: pageIndex,
    limit: pageSize,
    name: filterParams.name,
    email: filterParams.email,
  });

  const { mutateAsync: createUser } = useCreateUser();

  // #3. 테이블 인스턴스 생성
  const table = UserManageTable(
    data,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize
  );

  return (
    <div className="flex w-full flex-col">
      {/* 검색 영역 */}
      <div className="mb-4 flex justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
        <div className="size-full">
          <Label>사용자명</Label>
          <Input
            placeholder="검색할 사용자명..."
            value={filter.name}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="size-full">
          <Label>사용자 이메일</Label>
          <Input
            placeholder="검색할 사용자 이메일..."
            type="email"
            value={filter.email}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setFilter({ name: '', email: '' });
              setFilterParams({ name: '', email: '' });
              setPageIndex(0);
            }}
          >
            초기화
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setFilterParams(filter);
              setPageIndex(0);
            }}
          >
            검색
          </Button>
        </div>
      </div>

      {/* 사용자 테이블 영역 */}
      <div className="grow overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="flex justify-between gap-4 bg-white p-4 pb-0 pl-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">사용자 목록</h2>
          <CreateUserDialog
            open={showCreateDialog}
            setOpen={setShowCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onCreate={async (newUser: User) => {
              await createUser(newUser);
              setPageIndex(0); // 새로 생성한 유저가 보이도록 첫 페이지로 이동
            }}
          />
        </div>

        {/* 데이터 상태 처리 */}
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            데이터 불러오는 중...
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-red-500">
            오류로 인해 데이터를 불러오지 못했습니다. 다시 시도해주세요.
          </div>
        ) : (
          <>
            {/* 테이블 렌더링 */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-900"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-6 py-2 text-sm text-gray-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 컨트롤 */}
            <div className="flex items-center justify-center gap-8 p-4">
              <Button
                disabled={!table.getCanPreviousPage()}
                variant="outline"
                onClick={() => table.previousPage()}
              >
                이전
              </Button>
              <span className="text-sm text-gray-600">
                {table.getState().pagination.pageIndex + 1}p /{' '}
                {table.getPageCount()}p
              </span>
              <Button
                disabled={!table.getCanNextPage()}
                variant="outline"
                onClick={() => table.nextPage()}
              >
                다음
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
