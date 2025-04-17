'use client';

import React, { useState } from 'react';
import { useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  } from '@tanstack/react-table';
import type { User } from "@prisma/client";
import {
  useUsersQuery,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../_action/user-data-query';
import { UserManageTable } from '../_table/user-manage-table';

export const UserManagePage = () => {
const [pageSize, setPageSize] = useState(20);
const [pageIndex, setPageIndex] = useState(0);
const { data, isLoading, isError } = useUsersQuery({
  page: pageIndex + 1,
  limit: pageSize,
});

const table = UserManageTable(data, pageIndex, pageSize, setPageIndex, setPageSize);

if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error loading data</div>;

return (
  <div>
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div>
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        이전
      </button>
      <span>
        {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
      </span>
      <button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        다음
      </button>
    </div>
  </div>
);
};