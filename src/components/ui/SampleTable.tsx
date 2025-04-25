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
import { fetchC } from '@/lib/utils';

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
  const [params, setParams] = useState({ name: '', email: '', age: '' });
  const { rows, pageSize, pageIndex } = tableState;
  const { sortBy, sortOrder } = tableState;
  const { data, isError, isLoading, isFetching, isFetched, refetch } =

    useQuery<UserData>({
      queryKey: [
        "users",
        {
          endpoint: 'users',
          queryParams: {
            page: pageIndex,
            limit: pageSize,
            name: params.name,
            email: params.email,
            age: params.age,
            sort: sortBy,
            order: sortOrder,
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
  const EMPTY_ROWS = 10;
  const LOADING_MESSAGE = '데이터를 불러오고 있습니다.';
  const ERROR_MESSAGE = '데이터를 찾을 수 없습니다.';
  const NO_DATA_MESSAGE = '데이터가 없습니다. 데이터를 생성 해주세요.';

  const handleSearch = (newParams: {
    name: string;
    email: string;
    age: string;
  }) => {
    setParams(newParams);
    setTableState((prev) => ({ ...prev, pageIndex: 0 }));
    refetch();
  };

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
        <div className="flex flex-wrap items-start justify-between gap-6 px-4 py-2">
          <UserSearchBar className="my-3 p-3" onSearch={handleSearch} />
          <FunctionToolbar className="my-3 p-3" />
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
      <div className="flex flex-wrap items-start justify-between gap-6 px-4 py-2">
        <UserSearchBar className="my-3 p-3" onSearch={handleSearch} />
        <FunctionToolbar className="my-3 p-3" />
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
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const { sortBy, sortOrder } = tableState;

  // 정렬 핸들러 함수
  const handleSort = (columnId: string) => {
    if (sortBy === columnId) {
      // 이미 정렬된 컬럼이라면 방향만 토글
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setTableState((prev) => ({ ...prev, sortOrder: newOrder }));
    } else {
      // 새 컬럼 클릭 시 정렬 기준 변경
      setTableState((prev) => ({
        ...prev,
        sortBy: columnId as keyof User,
        sortOrder: 'asc', // 초기 정렬 방향은 asc
      }));
    }
  };

  return (
    <TableHeader className="sticky top-0 bg-gray-700 text-white dark:bg-slate-800">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const columnId = header.column.id;
            const isSortedColumn = sortBy === columnId;

            return (
              <TableHead
                key={header.id}
                className="cursor-pointer select-none text-center"
                colSpan={header.colSpan}
                onClick={() => handleSort(columnId)}
              >
                {header.isPlaceholder ? null : (
                  <div className="flex items-center justify-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {isSortedColumn && (
                      <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
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

//pagination 관련 컴포넌트트
export const TablePageController = () => {
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const { count, pageIndex, pageSize, pageCount } = tableState;

  // 현재 페이지 그룹 기준 계산 (5개씩 표시)
  const groupSize = 5;
  const currentGroup = Math.floor(pageIndex / groupSize);
  const startPage = currentGroup * groupSize;
  const endPage = Math.min(startPage + groupSize, pageCount);
  const handlePageClick = (index: number) => {
    setTableState((prev) => ({ ...prev, pageIndex: index }));
  };

  const goToPrevGroup = () => {
    if (startPage > 0) handlePageClick(startPage - groupSize);
    else if (startPage == 0) {
      handlePageClick(0);
    }
  };

  const goToNextGroup = () => {
    if (endPage < pageCount) handlePageClick(endPage);
    else handlePageClick(pageCount - 1);
  };

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div>총 {count.toLocaleString('ko-KR')} 항목</div>
      <div className="flex items-center gap-2">
        <Button disabled={pageIndex === 0} onClick={goToPrevGroup}>
          <RxDoubleArrowLeft size={20} />
        </Button>
        <Button
          disabled={pageIndex === 0}
          onClick={() => handlePageClick(pageIndex - 1)}
        >
          <RxChevronLeft size={20} />
        </Button>

        {Array.from({ length: endPage - startPage }, (_, i) => {
          const page = startPage + i;
          return (
            <Button
              key={page}
              className={pageIndex === page ? 'bg-blue-500 text-white' : ''}
              onClick={() => handlePageClick(page)}
            >
              {page + 1}
            </Button>
          );
        })}

        <Button
          disabled={pageIndex === pageCount - 1}
          onClick={() => handlePageClick(pageIndex + 1)}
        >
          <RxChevronRight size={20} />
        </Button>
        <Button disabled={pageIndex === pageCount - 1} onClick={goToNextGroup}>
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
