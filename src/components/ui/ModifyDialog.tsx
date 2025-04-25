'use client'; // React Client 컴포넌트 임을 명시

/** 필수 React 훅과 아이콘 라이브러리 */
import React, { useRef } from 'react';
import { RxPencil1 } from 'react-icons/rx';

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

/** Prisma의 User 모델 */
import type { User } from '@prisma/client';

/** 데이터 페치 및 상태 관리 라이브러리 */
import { useMutation } from '@tanstack/react-query';
import { fetchC } from '@/lib/utils';
import { useRecoilValue } from 'recoil';
import { sampleTableState } from '@/components/store/SampleTableState';

// 입력 필드의 props 타입 정의
type InputFieldProps = {
  name: string;
  label: string;
  defaultValue: string | number;
  disabled?: boolean;
  register?: (name: string) => void;
};

// 일반적인 입력 필드 컴포넌트 정의
const InputField = ({
  name,
  label,
  defaultValue,
  disabled = false,
  register,
}: InputFieldProps) => (
  <div>
    <Label htmlFor={name}>{label}</Label>
    <Input
      {...(register ? register(name) : {})}
      className="border"
      defaultValue={defaultValue}
      disabled={disabled}
      id={name}
      name={name}
      type="text"
    />
  </div>
);

// 사용자 정보 수정 다이얼로그의 props 타입 정의
type ModifyDialogProps = {
  user: User;
};

// 사용자 정보 수정 다이얼로그 컴포넌트 정의
const ModifyDialog = ({ user }: ModifyDialogProps) => {
  const { refetch } = useRecoilValue(sampleTableState);
  const { idx, name, email, age, visits, progress, status } = user;

  // useForm의 결과를 가져옴
  const { register, handleSubmit } = useForm();

  // 데이터 수정 시 사용할 mutation 훅
  const { mutate } = useMutation({
    mutationFn: fetchC,
    // 성공적으로 데이터가 수정됐을 때 실행할 콜백
    onSuccess: () => {
      refetch(); // 데이터를 다시 가져옴
      closeRef.current?.click(); // 다이얼로그를 닫음
    },
  });

  // ref로 다이얼로그 닫기 버튼을 참조
  const closeRef = useRef<HTMLButtonElement>(null);

  // 폼 데이터가 제출됐을 때 실행할 핸들러
  const onSubmit = (data: any) => {
    mutate({
      endpoint: `users`,
      method: 'PUT',
      body: { ...data, idx, status, name },
    });
  };

  // 컴포넌트 렌더링
  return (
    <Dialog>
      <DialogTrigger>
        <RxPencil1
          className={'cursor-pointer transition-all hover:ease-in-out'}
          size={20}
        />
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-inherit">
        <DialogHeader>
          <DialogTitle>사용자 정보 수정</DialogTitle>
        </DialogHeader>
        <form>
          <DialogDescription className="flex flex-col gap-2">
            <InputField disabled defaultValue={name} label="이름" name="name" />
            <InputField
              defaultValue={email}
              label="이메일"
              name="email"
              register={register}
            />
            <InputField
              defaultValue={age ||0}
              label="나이"
              name="age"
              register={register}
            />
            <InputField
              defaultValue={visits || 0}
              label="방문횟수"
              name="visits"
              register={register}
            />
            <InputField
              defaultValue={progress || 0}
              label="진행률"
              name="progress"
              register={register}
            />
            <InputField
              disabled
              defaultValue={status || ''}
              label="상태"
              name="status"
            />
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

export default ModifyDialog;
