"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/Table";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/atoms/Select";
import { useQuery } from "@tanstack/react-query";
import {
  Table as TableType,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  RxDoubleArrowLeft,
  RxDoubleArrowRight,
  RxChevronLeft,
  RxChevronRight,
} from "react-icons/rx";
import { User } from "@prisma/client";
import { defaultColumn } from "@/components/ui/SampleColumnDef";
import { useRecoilState } from "recoil";
import { sampleTableState } from "../SampleTableState";
import { FunctionToolbar } from "./FunctionButtons";

type Props = {
  initialData?: {
    rows: User[];
    count: number;
  };
};
type UserData = {
  rows: User[];
  count: number;
};

export function SampleTable({ initialData }: Props) {
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const { rows, pageSize, pageIndex } = tableState;
  const {
    data,
    isError,
    isLoading,
    isFetching,
    isFetched,
    refetch,
    isInitialLoading,
  } = useQuery<UserData>(
    [
      {
        endpoint: "users",
        queryParams: {
          page: pageIndex,
          limit: pageSize,
          sort: "createdAt",
          order: "desc",
        },
      },
    ],
    { initialData: initialData || { rows: [], count: 0 } },
  );
  useEffect(() => {
    initialData &&
      setTableState((prev) => ({
        ...prev,
        rows: data.rows,
        count: data.count,
        pageCount: Math.ceil(data.count / pageSize),
        refetch,
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFetched) {
      setTableState((prev) => ({
        ...prev,
        rows: data.rows,
        count: data.count,
        pageCount: Math.ceil(data.count / pageSize),
        refetch,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const table = useReactTable({
    data: rows || [],
    columns: defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  let notice = "";
  if (data.rows.length === 0) {
    if (isFetching || isLoading) notice = "데이터를 불러오고 있습니다.";
    if (isError) notice = "데이터를 찾을 수 없습니다.";
    if (isFetched && rows.length === 0)
      notice = "데이터가 없습니다. 데이터를 생성 해주세요.";
  }

  if (isLoading || isError || data.rows.length === 0)
    return (
      <div className="mx-auto max-w-screen-2xl">
        <FunctionToolbar />
        <div className="h-[36vh] overflow-auto">
          <Table className="my-4" maxHeight="35vh">
            <SampleTableHeader table={table} />
            <TableBody className="h-96 overflow-y-auto">
              {[...Array(10)].map((_, index) => (
                <TableRow className="border-b-0 " key={index}>
                  {index === 2 ? (
                    <TableCell
                      className="my-auto items-center text-center"
                      colSpan={defaultColumn.length}
                    >
                      {notice}
                    </TableCell>
                  ) : (
                    <TableCell
                      className="my-auto items-center text-center"
                      colSpan={defaultColumn.length}
                    >
                      {"ㅤ"}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TablePageController />
      </div>
    );
  return (
    <div className="mx-auto max-w-screen-2xl">
      <FunctionToolbar />
      <div className="h-[36vh] overflow-auto">
        <Table className="my-4" maxHeight="35vh">
          <SampleTableHeader table={table} />
          <SampleTableBody table={table} />
        </Table>
      </div>
      <TablePageController />
    </div>
  );
}
SampleTable.displayName = "SampleTable";

function SampleTableHeader({ table }: { table: TableType<User> }) {
  return (
    <TableHeader
      className="sticky top-0 bg-gray-700 text-white dark:bg-slate-800"
      // style={{ position: "sticky", top: "0px", background: "black" }}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                className="text-center"
                key={header.id}
                colSpan={header.colSpan}
              >
                {header.isPlaceholder ? null : (
                  <div>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </div>
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}

function SampleTableBody({ table }: { table: TableType<User> }) {
  return (
    <TableBody className="h-96 overflow-y-auto">
      {table.getRowModel().rows.map((row) => {
        return (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
}

export function TablePageController() {
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const { count, pageIndex, pageSize, pageCount } = tableState;
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div>총 {count.toLocaleString("ko-KR")} 항목</div>
      <div className="flex gap-2">
        <Button
          className="rounded border p-1 shadow-none"
          onClick={() => setTableState((prev) => ({ ...prev, pageIndex: 0 }))}
          disabled={pageIndex === 0}
        >
          <RxDoubleArrowLeft size={20} />
        </Button>
        <Button
          className="rounded border p-1 shadow-none"
          onClick={() =>
            setTableState((prev) => ({ ...prev, pageIndex: pageIndex - 1 }))
          }
          disabled={pageIndex === 0}
        >
          <RxChevronLeft size={20} />
        </Button>
        <span className="flex items-center gap-1">
          <p>
            <strong>{pageCount === 0 ? 1 : pageCount}</strong> 페이지 중{" "}
            <strong>{pageIndex + 1}</strong> 페이지
          </p>
        </span>
        <Button
          className="rounded border p-1 shadow-none"
          onClick={() =>
            setTableState((prev) => ({ ...prev, pageIndex: pageIndex + 1 }))
          }
          disabled={pageIndex === pageCount - 1}
        >
          <RxChevronRight size={20} />
        </Button>
        <Button
          className="rounded border p-1 shadow-none"
          onClick={() =>
            setTableState((prev) => ({ ...prev, pageIndex: pageCount - 1 }))
          }
          disabled={pageIndex === pageCount - 1}
        >
          <RxDoubleArrowRight size={20} />
        </Button>
      </div>
      <Select
        defaultValue={pageSize.toString()}
        onValueChange={(e) => {
          setTableState((prev) => ({
            ...prev,
            pageSize: Number(e),
            pageIndex: 0,
          }));
        }}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder={pageSize} />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 30, 40, 50].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
TablePageController.displayName = "TablePageController";
