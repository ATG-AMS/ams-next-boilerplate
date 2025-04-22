'use client'; // React Client 컴포넌트 임을 명시

import { Button } from '@/components/atoms/Button';
import { cn, fetchC } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect,useState } from 'react';
import type { Person } from '@/lib/makeData';
import { makeData } from '@/lib/makeData';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { sampleTableState } from '@/components/store/SampleTableState';
import { createUserAction } from '@/lib/userAction';
import { VscLoading } from "react-icons/vsc";
import { IoMdAdd } from "react-icons/io";
import CreateDialog from './CreateDialog';

// 도구 툴바 컴포넌트. 데이터 생성 및 초기화 버튼을 포함
export const FunctionToolbar = ({ className }: { className?: string }) => {
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const { refetch } = tableState;

  // 첫 번째 페이지로 되돌리는 함수
  const resetToFirstPage = () => {
    setTableState((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className={cn('flex justify-end space-x-2', className)}>
      <ManualData/>
      <GenerateData
        className="border-r border-gray-400"
        refetch={refetch}
        syncState={resetToFirstPage}
      />
      <ResetButton refetch={refetch} syncState={resetToFirstPage} />
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
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  // Single mutation for all operations
  const { mutate, isPending } = useMutation({
    // The mutation function now handles batched operations
    mutationFn: async (data: { persons: Person[] }) => {
      const { persons } = data;
      setProgress(0);
      setTotal(persons.length);

      // Track completed requests
      let completed = 0;

      // Process all requests in parallel and wait for all to complete
      await Promise.all(
        persons.map(async (person) => {
          try {
            //mutation : method 1
            // await fetch(`${process.env.NEXT_PUBLIC_API_URI}/users`, {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify(person),
            // }).then((res) => {
            //   if (!res.ok) {
            //     throw new Error('Network response was not ok');
            //   }
            // completed++;
            // setProgress(completed);
            // })
            //mutation : method 2
            // Make the API call for each person
            // await fetchC({
            //   endpoint: 'users',
            //   method: 'POST',
            //   body: person,
            // });
            //mutation : method 3
            //using ServerActions
            const result = await createUserAction(person);
            completed = result.completed


          } catch (error) {
            console.error('Error creating person:', error);
            throw error; // Re-throw to mark the overall operation as failed
          } finally {
            setProgress(completed)
          }
        })
      );

      // Return something to indicate success
      return { success: true, count: persons.length };
    },
    // When the entire batch operation succeeds
    onSuccess: () => {
      syncState();
      refetch();
    },
    // Handle any errors in the batch operation
    onError: (error) => {
      console.error('Error in batch operation:', error);
      alert('데이터 생성 중 오류가 발생했습니다.');
    }
  });

  const handleGenerateData = (inputValue: Record<string, unknown>) => {
    try {
      const { rows } = inputValue;
      const numberOfRows = rows as number;

      // Generate dummy data
      const dummyData: Person[] = makeData(numberOfRows);

      // Pass the entire array to the mutation function
      mutate({ persons: dummyData });
    } catch (error) {
      console.error('Error generating data:', error);
      alert('데이터 생성 중 오류가 발생했습니다.');
    }
  };

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
        disabled={isPending}
        onClick={handleSubmit(handleGenerateData)}
      >
        {isPending ?
          <><span>{'생성중...'}</span><span className='animate-spin'><VscLoading /></span></> :
          '생성'
        }
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


// 수동으로 데이터를 입력하는 컴포넌트
export const ManualData = () => {
//
  const [isOpen, setIsOpen] = useState<boolean>(false);

 const handleClick = () => {
    setIsOpen((prev:boolean)=> !prev);
  }
  return (
    <>
    <Button className='flex space-x-1 border border-gray-200' onClick={handleClick}><IoMdAdd /><span>{"수동생성"}</span></Button>
    <CreateDialog isOpen={isOpen} setIsOpen={setIsOpen}  />
    </>
  )
}
