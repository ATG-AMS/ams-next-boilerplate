'use client'; // React Client 컴포넌트 임을 명시

/** 필수 React 훅과 아이콘 라이브러리 */
import React, { useEffect, useState } from 'react';
import {
  RxDoubleArrowLeft,
  RxDoubleArrowRight,
  RxChevronLeft,
  RxChevronRight,
} from 'react-icons/rx';

/** UI 컴포넌트들 */
import { Button } from '@/components/atoms/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/Table';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/atoms/Select';
import { FunctionToolbar } from '@/components/ui/FunctionButtons';
import { UserSearchBar } from '@/app/search-user/_component/UserSearchBar';

/** 데이터를 가져오는데 사용되는 react-query 훅 */
import { useQuery } from '@tanstack/react-query';

/** Headless react-table 관련 라이브러리 */
import type { Table as TableType } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

/** Prisma의 User 모델 */
import type { User } from '@prisma/client';

/** 사전 정의한 컬럼 설정 정보 */
import { defaultColumn } from '@/components/ui/SampleColumnDef';

/** Recoil 상태 관리 훅과 정의한 atom */
import { useRecoilState } from 'recoil';
import { sampleTableState } from '@/components/store/SampleTableState';

// Props와 UserData 타입을 정의
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

// SampleTable 컴포넌트를 정의
export const SampleTable = ({ initialData }: Props) => {
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const [params, setParams] = useState({name: '', email: '', age: ''});
  const { rows, pageSize, pageIndex } = tableState;

  const { data, isError, isLoading, isFetching, isFetched, refetch } =
  useQuery<UserData>({
    queryKey: [
      {
        endpoint: 'users',
        queryParams: {
          page: pageIndex,
          limit: pageSize,
          name: params.name,
          email: params.email,
          age: params.age,
          sort: 'createdAt',
          order: 'desc',
        },
      },
    ],
    initialData: initialData || { rows: [], count: 0 },
  });

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
  const notice = '';
  const EMPTY_ROWS = 10;
  const LOADING_MESSAGE = '데이터를 불러오고 있습니다.';
  const ERROR_MESSAGE = '데이터를 찾을 수 없습니다.';
  const NO_DATA_MESSAGE = '데이터가 없습니다. 데이터를 생성 해주세요.';

  const handleSearch = (newParams : {name: string; email: string; age: string }) => {
    setParams(newParams);
    setTableState((prev) => ({ ...prev, pageIndex: 0 }));
    refetch();
  }

  // 데이터의 로딩, 에러, 빈 상태에 따라 메시지를 렌더링하는 함수
  function renderDataStatusMessage(
    isFetching: boolean,
    isLoading: boolean,
    isError: boolean,
    rows: User[]
  ): string | null {
    if (isFetching || isLoading) return LOADING_MESSAGE;
    if (isError) return ERROR_MESSAGE;
    if (rows.length === 0) return NO_DATA_MESSAGE;
    return null;
  }
  const statusMessage = renderDataStatusMessage(
    isFetching,
    isLoading,
    isError,
    data.rows
  );

  if (statusMessage || data.rows.length === 0)
    return (
      <div className="mx-auto max-w-screen-2xl">

        {/* 상단 툴바 & 검색바 섹션  */}
        <div className="flex flex-wrap justify-between items-start gap-6 px-4 py-2">
          <UserSearchBar className="bg-white rounded-xl shadow-sm p-3 my-3" onSearch={handleSearch} />
          <FunctionToolbar className="bg-white rounded-xl shadow-sm p-3 my-3" />
        </div>

        <div className="h-[36vh] overflow-auto">
          <Table className="my-4" maxHeight="35vh">
            <SampleTableHeader table={table} />
            <TableBody className="h-96 overflow-y-auto">
              {[...Array(EMPTY_ROWS)].map((_, index) => (
                <TableRow key={index} className="border-b-0 ">
                  <TableCell
                    className="my-auto items-center text-center"
                    colSpan={defaultColumn.length}
                  >
                    {index === 2 ? statusMessage : 'ㅤ'}
                  </TableCell>
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
      {/* 상단 툴바 & 검색바 섹션  */}
      <div className="flex flex-wrap justify-between items-start gap-6 px-4 py-2">
        <UserSearchBar className="bg-white rounded-xl shadow-sm p-3 my-3" onSearch={handleSearch} />
        <FunctionToolbar className="bg-white rounded-xl shadow-sm p-3 my-3" />
      </div>
      <div className="h-[36vh] overflow-auto">
        <Table className="my-4" maxHeight="35vh">
          <SampleTableHeader table={table} />
          <SampleTableBody table={table} />
        </Table>
      </div>
      <TablePageController />
    </div>
  );
};
SampleTable.displayName = 'SampleTable';

// 테이블 헤더 부분을 렌더링하는 컴포넌트
const SampleTableHeader = ({ table }: { table: TableType<User> }) => {
  return (
    <TableHeader className="sticky top-0 bg-gray-700 text-white dark:bg-slate-800">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className="text-center"
                colSpan={header.colSpan}
              >
                {header.isPlaceholder ? null : (
                  <div>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
};

// 테이블 바디 부분을 렌더링하는 컴포넌트
const SampleTableBody = ({ table }: { table: TableType<User> }) => {
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
};

// 테이블의 페이지네이션을 제어하는 컴포넌트
export const TablePageController = () => {
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const { count, pageIndex, pageSize, pageCount } = tableState;
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div>총 {count.toLocaleString('ko-KR')} 항목</div>
      <div className="flex gap-2">
        <Button
          className="rounded border p-1 shadow-none"
          disabled={pageIndex === 0}
          onClick={() => setTableState((prev) => ({ ...prev, pageIndex: 0 }))}
        >
          <RxDoubleArrowLeft size={20} />
        </Button>
        <Button
          className="rounded border p-1 shadow-none"
          disabled={pageIndex === 0}
          onClick={() =>
            setTableState((prev) => ({ ...prev, pageIndex: pageIndex - 1 }))
          }
        >
          <RxChevronLeft size={20} />
        </Button>
        <span className="flex items-center gap-1">
          <p>
            <strong>{pageCount === 0 ? 1 : pageCount}</strong> 페이지 중{' '}
            <strong>{pageIndex + 1}</strong> 페이지
          </p>
        </span>
        <Button
          className="rounded border p-1 shadow-none"
          disabled={pageIndex === pageCount - 1}
          onClick={() =>
            setTableState((prev) => ({ ...prev, pageIndex: pageIndex + 1 }))
          }
        >
          <RxChevronRight size={20} />
        </Button>
        <Button
          className="rounded border p-1 shadow-none"
          disabled={pageIndex === pageCount - 1}
          onClick={() =>
            setTableState((prev) => ({ ...prev, pageIndex: pageCount - 1 }))
          }
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
};
TablePageController.displayName = 'TablePageController';
