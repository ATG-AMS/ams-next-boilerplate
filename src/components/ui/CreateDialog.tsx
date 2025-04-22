/* eslint-disable no-console */
'use client'; // React Client 컴포넌트 임을 명시

/** 필수 React 훅과 아이콘 라이브러리 */
import React, { useEffect, useRef } from 'react';
import { RxPencil1 } from 'react-icons/rx';
import { FaExclamationCircle } from 'react-icons/fa';

/** UI 컴포넌트들 */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/atoms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { Input } from '@/components/atoms/Input';

/** 폼 핸들링을 위한 react-hook-form 라이브러리의 Hook */
import { useForm } from 'react-hook-form';
import type { UseFormRegister } from 'react-hook-form';

/** Prisma의 User 모델 */
import type { User } from '@prisma/client';

/** 데이터 페치 및 상태 관리 라이브러리 */
import { useMutation } from '@tanstack/react-query';
import { cn, fetchC } from '@/lib/utils';
import { useRecoilValue } from 'recoil';
import { sampleTableState } from '@/components/store/SampleTableState';
// 입력 필드의 props 타입 정의
type FormValues = {
  name: string;
  email: string;
  age: number;
  visits: number;
  progress: number;
  status: string;
};

type InputFieldProps = {
  name: keyof FormValues;
  label: string;
  defaultValue: string | number;
  disabled?: boolean;
  registerResult?: UseFormRegister<FormValues>;
};

// 사용자 정보 수정 다이얼로그의 props 타입 정의
type ModifyDialogProps = {
  // user: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

// 사용자 정보 수정 다이얼로그 컴포넌트 정의
const CreateDialog = ({ isOpen, setIsOpen }: ModifyDialogProps) => {
  const { refetch } = useRecoilValue(sampleTableState);
  // const { idx, name, email, age, visits, progress, status } = user;

  // useForm의 결과를 가져옴
  const { register, handleSubmit, formState, reset, setError } = useForm();

  const { errors } = formState;
  // 데이터 수정 시 사용할 mutation 훅
  const { mutate } = useMutation({
    mutationFn: fetchC,
    // 성공적으로 데이터가 수정됐을 때 실행할 콜백
    onSuccess: () => {
      refetch(); // 데이터를 다시 가져옴
      closeRef.current?.click(); // 다이얼로그를 닫음
    },
    onError: (error) => {
      console.log(error);
      console.log(error.message);
    },
  });

  // ref로 다이얼로그 닫기 버튼을 참조
  const closeRef = useRef<HTMLButtonElement>(null);

  // 폼 데이터가 제출됐을 때 실행할 핸들러
  const onSubmit = async (data: any) => {
    console.log(data);

    const response = await fetch(`/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    const responseData = await response.json();
    if(!responseData.success){
      const errorMessage=responseData.data.message
      // alert(`${errorMessage}`)
      setError('email', {
        type: 'server',
        message: errorMessage,
      });
    }
    else{
      setIsOpen(false);
      reset()
      refetch()
    }

  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);



  // 컴포넌트 렌더링
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger>
        <RxPencil1
          className={'cursor-pointer transition-all hover:ease-in-out'}
          size={20}
        />
      </DialogTrigger> */}
      <DialogContent className="bg-white dark:bg-inherit">
        <DialogHeader>
          <DialogTitle>사용자 정보 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogDescription className="flex flex-col gap-2">
            <div>
              <div
                  className={cn(
                    ['flex items-center justify-between gap-2'],
                    errors.name ? 'text-red-500' : ''
                  )}
                >
                  <Label htmlFor="email">이름*</Label>
                  {errors.name && (
                    <div className="flex items-center gap-2">
                      <FaExclamationCircle  />
                      {/* <p>{'이름을 입력해주세요.'}</p> */}
                      <p>{errors.name.message as string}</p>
                    </div>
                  )}
                </div>
                <Input
                  className="border"
                  defaultValue={''}
                  id="name"
                  type="text"
                  {...register('name', { required: "이름을 입력하시오!" })}
                />
              </div>
            <div>
              <div
                className={cn(
                  ['flex items-center justify-between gap-2'],
                  errors.email ? 'text-red-500' : ''
                )}
              >
                <Label htmlFor="email">이메일*</Label>
                {errors.email && (
                  <div className="flex items-center gap-2">
                    <FaExclamationCircle  />
                    <p>{`${errors?.email?.message}`}</p>
                  </div>
                )}
              </div>
              <Input
                className="border"
                defaultValue={''}
                id="email"
                type="email"
                {...register('email', { required: "이메일을 입력하세요"  })}
              />
            </div>
            <div>
              <Label htmlFor="age">나이</Label>
              <Input
                className="border"
                defaultValue={''}
                id="name"
                type="number"
                {...register('age', {  valueAsNumber:true})}
              />
            </div>
            <div>
              <Label htmlFor="visits">방문횟수</Label>
              <Input
                className="border"
                defaultValue={0}
                id="visits"
                type="number"
                {...register('visits',{valueAsNumber:true})}
              />
            </div>
            <div>
              <Label htmlFor="progress">진행률</Label>
              <Input
                className="border"
                defaultValue={0}
                id="progress"
                type="number"
                {...register('progress',{valueAsNumber:true})}
              />
            </div>
            <div>
              <Label htmlFor="status">상태</Label>
              <Input
                className="border"
                defaultValue={0}
                id="status"
                type="text"
                {...register('status')}
              />
            </div>
          </DialogDescription>
          <DialogFooter className="mt-2">
            <Button
              className="hover:bg-green-100"
              onClick={handleSubmit(onSubmit)}
            >
              저장
            </Button>
            <DialogClose ref={closeRef} className="hover:bg-green-100">
              취소
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
