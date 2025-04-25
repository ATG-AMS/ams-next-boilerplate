'use client';

// #0. 사용할 라이브러리 등 Import
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { Input } from '@/components/atoms/Input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/atoms/Dialog';

// #1. 이 파일 내에서 사용할 타입 및 인터페이스 정의
interface UserDialogProps {
  user?: User | null;
  isCreate?: boolean; // true: 사용자 추가, false: 사용자 수정
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: User) => void;
}
interface User {
  idx?: number;
  name: string;
  email: string;
  age?: number;
  visits?: number;
  progress?: number;
  status?: string;
  createdAt?: Date | string;
}

// #2. 유효성 검사 (Zod 사용)
const userSchema = z.object({
  name: z.string().min(1, '이름은 필수 입력 항목입니다.'),
  email: z.string().email('유효한 이메일 주소를 입력해 주세요.'),
  age: z
    .union([
      z
        .number()
        .int('나이는 자연수로 입력하거나, 비워놓으세요.')
        .positive('나이는 자연수로 입력하거나, 비워놓으세요.')
        .min(1),
      z.nan(),
    ])
    .optional(),
  visits: z
    .union([
      z
        .number()
        .int('방문 횟수는 자연수로 입력하거나, 비워놓으세요.')
        .nonnegative('방문 횟수는 자연수로 입력하거나, 비워놓으세요.'),
      z.nan(),
    ])
    .optional(),
  progress: z
    .union([
      z
        .number()
        .int('방문 횟수는 0~100의 정수 값으로 입력하거나, 비워놓으세요.')
        .min(0, '방문 횟수는 0~100의 정수 값으로 입력하거나, 비워놓으세요.')
        .max(100, '방문 횟수는 0~100의 정수 값으로 입력하거나, 비워놓으세요.'),
      z.nan(),
    ])
    .optional(),
  status: z.string().optional(),
});

const formOptions = {
  resolver: zodResolver(userSchema),
};

// #3. 사용자 정보 추가 및 수정 대화 상자 컴포넌트 정의
export const SingleUserDialog = ({
  user = null,
  isCreate = true,
  isOpen,
  setIsOpen,
  onSubmit,
}: UserDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user || {
      name: '',
      email: '',
      age: undefined,
      visits: undefined,
      progress: undefined,
      status: undefined,
    },
    ...formOptions,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          {isCreate ? '사용자 추가' : '사용자 수정'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>{isCreate ? '사용자 추가' : '사용자 수정'}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? '아래에 정보를 입력하여 사용자를 추가하세요.'
              : '아래 정보 중 수정 가능한 것들을 수정할 수 있습니다.'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">
              이름 <span className="text-orange-400">*</span>
            </Label>
            <Input
              {...register('name')}
              disabled={!isCreate}
              id="name"
              placeholder="이름 입력 (예: 홍길동)"
              type="text"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="email">
              이메일 주소 <span className="text-orange-400">*</span>
            </Label>
            <Input
              {...register('email')}
              id="email"
              placeholder="이메일 입력 (예: example@example.com)"
              type="email"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="age">나이</Label>
            <Input
              {...register('age', { valueAsNumber: true })}
              id="age"
              placeholder="나이 입력 (예: 27)"
              type="number"
            />
            {errors.age && (
              <span className="text-red-500">{errors.age.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="visits">방문 횟수</Label>
            <Input
              {...register('visits', { valueAsNumber: true })}
              id="visits"
              placeholder="방문 횟수 입력 (예: 5)"
              type="number"
            />
            {errors.visits && (
              <span className="text-red-500">{errors.visits.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="progress">진행률</Label>
            <Input
              {...register('progress', { valueAsNumber: true })}
              id="progress"
              placeholder="진행률 입력 (예: 50)"
              type="number"
            />
            {errors.progress && (
              <span className="text-red-500">{errors.progress.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="status">상태</Label>
            <Input
              {...register('status')}
              id="status"
              placeholder="상태 입력 (예: single)"
              type="text"
            />
            {errors.status && (
              <span className="text-red-500">{errors.status.message}</span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">사용자 {isCreate ? '추가' : '수정'}</Button>
            <Button type="button" onClick={() => setIsOpen(false)}>
              취소
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
