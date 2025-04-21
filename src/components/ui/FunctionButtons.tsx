'use client'; // React Client 컴포넌트 임을 명시

import { Button } from '@/components/atoms/Button';
import { cn, fetchC } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import type { Person } from '@/lib/makeData';
import { makeData } from '@/lib/makeData';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { sampleTableState } from '@/components/store/SampleTableState';
import { useState } from 'react';
import { CreateUserModal } from '@/app/user/_component/CreateUserModal';

// 도구 툴바 컴포넌트. 데이터 생성 및 초기화 버튼을 포함
export const FunctionToolbar = ({ className }: { className?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const { refetch } = tableState;

  // 첫 번째 페이지로 되돌리는 함수
  const resetToFirstPage = () => {
    setTableState((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className={cn('flex justify-end', className)}>
      <GenerateData
        className="border-r border-gray-400"
        refetch={refetch}
        syncState={resetToFirstPage}
      />
      <Button onClick={() => setIsModalOpen(true)}>수동 생성</Button>
      <ResetButton refetch={refetch} syncState={resetToFirstPage} />

      {isModalOpen && (
        <CreateUserModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

// Props 타입 정의
type Props = {
  className?: string;
  refetch: () => void;
  syncState: () => void;
  resetSize?: () => void;
};

// 데이터를 생성하는 컴포넌트
export const GenerateData = ({ className, refetch, syncState }: Props) => {
  const { register, handleSubmit } = useForm();
  const { mutate, status } = useMutation({ mutationFn: fetchC });

  // 더미 데이터를 생성하고 API에 데이터를 전송하는 함수
  const handleGenerateData = async (inputValue: Record<string, unknown>) => {
    try {
      const { rows } = inputValue;
      const dummyData: Person[] = makeData(rows as number);
      dummyData.forEach((person) => {
        mutate({
          endpoint: 'users',
          method: 'POST',
          body: person,
        });
      });
    } catch (error) {
      console.error('Error generating data:', error);
    }
  };

  // 데이터 생성이 성공한 후 상태를 동기화하고 데이터를 다시 가져오는 Hook
  useEffect(() => {
    if (status === 'success') {
      syncState();
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <form className={cn('flex items-center ', className)}>
      <Label className="items-start" htmlFor="rows">
        생성할 데이터의 수 : &nbsp;
      </Label>
      <Input
        className="w-24 bg-gray-200 shadow-2xl dark:bg-transparent"
        placeholder="1,000"
        type="number"
        {...register('rows', { required: true, min: 1, max: 1000 })}
        required
        max={1000}
        min={1}
      />
      <Button
        className="text-lg shadow-none"
        onClick={handleSubmit(handleGenerateData)}
      >
        생성
      </Button>
    </form>
  );
};

// 데이터를 초기화하는 버튼 컴포넌트
export const ResetButton = ({ className, refetch, syncState }: Props) => {
  const { mutate } = useMutation({
    mutationFn: fetchC,
    onSuccess: () => {
      syncState();
      refetch();
    },
  });

  // 데이터 초기화 요청을 보내는 함수
  const handleResetData = () => {
    mutate({
      endpoint: 'users',
      method: 'DELETE',
      body: { idx: 'reset-data' },
    });
  };

  return (
    <Button
      className={cn('text-lg shadow-none', className)}
      onClick={handleResetData}
    >
      초기화
    </Button>
  );
};
