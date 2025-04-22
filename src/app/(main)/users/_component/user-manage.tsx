'use client';

import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import type { User } from '../_interface/users-interface';
import { useUsersQuery, useCreateUser } from '../_action/user-data-query';
import { UserManageTable } from '../_table/user-manage-table';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { CreateUserDialog } from './user-create';
import { Label } from '@/components/atoms/Label';

export const UserManagePage = () => {
  const [pageSize, setPageSize] = useState<number>(15);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [filter, setFilter] = useState({
    name: '',
    email: '',
  });
  const [filterParams, setFilterParams] = useState({
    name: '',
    email: '',
  });
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const { data, isLoading, isError } = useUsersQuery({
    sort: 'idx',
    order: 'desc',
    page: pageIndex,
    limit: pageSize,
    name: filterParams.name,
    email: filterParams.email,
  });
  const { mutateAsync: createUser } = useCreateUser();

  const table = UserManageTable(
    data,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize
  );

  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 flex justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 align-bottom shadow-md">
        {/* 사용자 검색 */}
        <div className="size-full">
          <Label>사용자명</Label>
          <Input
            placeholder="검색할 사용자명..."
            type="text"
            value={filter.name}
            onChange={(event) =>
              setFilter((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        </div>
        <div className="size-full">
          <Label htmlFor="targetUserID">사용자 이메일</Label>
          <Input
            placeholder="검색할 사용자 이메일..."
            type="mail"
            value={filter.email}
            onChange={(event) =>
              setFilter((prev) => ({ ...prev, email: event.target.value }))
            }
          />
        </div>
        <div>
          <div className="flex h-full items-center justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setFilterParams({ name: '', email: '' });
                setFilter({ name: '', email: '' });
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
      </div>
      <div className="grow overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="flex w-full justify-between gap-4 bg-white p-4 pb-0 pl-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">사용자 목록</h2>
          <CreateUserDialog
            open={showCreateDialog}
            setOpen={setShowCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onCreate={async (newUser: User) => {
              await createUser(newUser);
              setPageIndex(0);
            }}
          />
        </div>
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
            <div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="overflow-hidden bg-gray-50">
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
            </div>
            <div className="flex items-center justify-center gap-8 p-4">
              <Button
                disabled={!table.getCanPreviousPage()}
                variant={'outline'}
                onClick={() => table.previousPage()}
              >
                이전
              </Button>
              <span className="text-sm text-gray-600">
                {table.getState().pagination.pageIndex + 1}p /&nbsp;
                {table.getPageCount()}p
              </span>
              <Button
                disabled={!table.getCanNextPage()}
                variant={'outline'}
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
