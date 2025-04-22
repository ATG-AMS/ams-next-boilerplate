import { useState } from 'react';
import { useCreateUser } from '../_action/user-data-query';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/atoms/Dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type User } from '../_interface/users-interface';

// #1. 유저 생성 폼 스키마 정의
const createUserSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상 입력해야 합니다.'),
  email: z.string().email('이메일 형식이 올바르지 않습니다.'),
  age: z.coerce.number().min(0, '나이는 0 이상이어야 합니다.'),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

interface CreateUserDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: () => void;
  onCreate: (newUser: User) => Promise<void>;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  setOpen,
  onClose,
  onCreate,
}) => {
  const { mutateAsync, isPending } = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
  });

  // #2. 사용자 생성 핸들러
  const onSubmit = async (data: CreateUserForm) => {
    try {
      const newUserData = {
        name: data.name,
        email: data.email,
        age: data.age ?? null,
        visits: 0,
        progress: 0,
        status: 'active',
        createdAt: new Date(),
      } as User;
      const newUser = await mutateAsync(newUserData);
      reset();
      setOpen(false);
      await onCreate(newUser);
    } catch (error) {
      console.error(error as Error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) onClose();
      }}
    >
      <DialogTrigger className="focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 shrink-0 items-center justify-center text-ellipsis whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50">
        사용자 추가
      </DialogTrigger>
      <DialogContent className="w-full max-w-md text-black">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>새 사용자 추가</DialogTitle>
            <DialogDescription>
              이름, 이메일, 나이를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium" htmlFor="name">
              이름
            </label>
            <input
              id="name"
              {...register('name')}
              className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              {...register('email')}
              className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium" htmlFor="age">
              나이
            </label>
            <input
              id="age"
              type="number"
              {...register('age')}
              className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.age && (
              <span className="text-sm text-red-500">{errors.age.message}</span>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              className="rounded bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
              type="button"
            >
              취소
            </DialogClose>
            <button
              className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              disabled={isPending}
              type="submit"
            >
              {isPending ? '저장 중...' : '저장'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
