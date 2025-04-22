'use client'; // React Client 컴포넌트 임을 명시

import { Button } from '@/components/atoms/Button';
import { cn, fetchC } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Person } from '@/lib/makeData';
import { makeData } from '@/lib/makeData';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { sampleTableState } from '@/components/store/SampleTableState';
import { manualAddUserSchema, type ManualAddUserFormData } from '../../app/hsr/_schema/manualAddUserSchema';

// 도구 툴바 컴포넌트. 데이터 생성 및 초기화 버튼을 포함
export const FunctionToolbar = ({ className }: { className?: string }) => {
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
      <ResetButton refetch={refetch} syncState={resetToFirstPage} />
      <ManualAddData refetch={refetch} syncState={resetToFirstPage} />
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

const checkEmail = async (email: string) => {
  const response = await fetch('/api/check-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('이메일 중복 확인 실패');
  }

  // console.log('요청옴:', response.json());  -> 비동기함수는 내부적으로 스트림데이터! 즉 한번 호출하면 끝!
  return response.json();
};

//(온보딩) 데이터 직접 추가 요청을 보내는 함수
export const ManualAddData = ({ className, refetch, syncState }: Props) => {

  const [isOpen, setIsOpen] = useState(false); //폼 보여줌 여부
  const [emailExists, setEmailExists] = useState(false); //이메일 존재 여부
  const [isEmailChecked, setIsEmailChecked] = useState(false); //이메일 인증 여부 (창 열리자마자 readonly 처리 방지용)
  const [showVerifyMsg, setShowVerifyMsg] = useState(false);  // 이메일 인증메시지 보여줌 여부

  const { register, handleSubmit, reset
          , formState: { errors }, getValues } = useForm<ManualAddUserFormData>({
    resolver: zodResolver(manualAddUserSchema),
    mode: 'onChange',
    shouldFocusError: false,
  });

  const onSubmit = (data: ManualAddUserFormData) => {
    if (!isEmailChecked || emailExists) {
      setShowVerifyMsg(true);
      return;
    }

    postUserData(data);
    resetFormState();
  };

  const resetFormState = () => {
    setIsOpen(false);
    reset();
    setIsEmailChecked(false);
    setEmailExists(false);
    setShowVerifyMsg(false);
  }

  //TODO : useMutate 활용
  const postUserData = async (data: ManualAddUserFormData) => {

    const newData = {
      ...data,
      name: data.name.replace(/\s+/g, ""),
      age: data.age ?? 0,
      visits: data.visits ?? 0,
      progress: data.progress ?? 0,
      status: data.status ?? '',
    };

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error('데이터 직접 추가 실패');
    }

    refetch();
    return response.json();
  };

  const handleCheckEmail = async (email: string) => {
    //TODO : 값이 비어있거나 이메일 형식 안맞을 때 분기처리 해야함
    try {
      const { isAvailable } = await checkEmail(email);
      setEmailExists(!isAvailable);
      setIsEmailChecked(true);
      setShowVerifyMsg(false);
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      setEmailExists(false);
      setIsEmailChecked(false);
    }
  };

  return (
    <>
      <Button className={cn('text-lg shadow-none')} onClick={() => setIsOpen(true)}>+ 직접 입력</Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="rounded-xl bg-white p-7 shadow-xl w-[30%]">
            <h2 className="text-xl font-bold mb-4">데이터 직접 입력</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              <div>
                <label className="block mb-1 font-medium">
                  이메일 <span className="text-orange-500 font-bold">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    placeholder='예) abc@email.com'
                    {...register('email')}
                    readOnly={isEmailChecked && !emailExists}
                    className={cn(
                      'w-full rounded border px-3 py-3 text-lg',
                      (errors.email || emailExists) && 'border-red-500',
                      isEmailChecked && !emailExists && 'bg-gray-200 cursor-not-allowed'
                    )}
                  />
                  <Button
                    variant={'ghost'}
                    type="button"
                    onClick={() => handleCheckEmail(getValues('email'))}
                    className="h-[55px] w-[20px]"
                  >
                    확 인
                  </Button>
                </div>
                {emailExists && (
                  <p className="text-red-500 text-sm mt-1">이미 등록된 이메일입니다.</p>
                )}
                {!emailExists && isEmailChecked && !errors.email && (
                  <p className="text-green-600 text-sm mt-1">사용 가능한 이메일입니다.</p>
                )}
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  이름 <span className="text-orange-500 font-bold">*</span>
                </label>

                <input
                  placeholder='예) 홍길동'
                  {...register('name')}
                  className={cn(
                    'w-full rounded border px-3 py-3 text-lg',
                    errors.name && 'border-red-500'
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">나이</label>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="예) 23"
                    {...register('age', {
                      setValueAs: (value) => value === '' ? undefined : Number(value),
                    })}
                    className={cn(
                      'w-24 rounded border px-3 py-2 text-lg',
                      errors.age && 'border-red-500'
                    )}
                  />
                  <span className="text-lg text-gray-700">세</span>
                </div>
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {resetFormState()}}
                >
                  취소
                </Button>
                <Button type="submit" variant="outline">추가</Button>
              </div>

              {showVerifyMsg && (
                <p className="text-red-600 text-sm mt-2 text-right font-semibold">
                  이메일 인증 또는 다른 이메일을 사용해주세요.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
