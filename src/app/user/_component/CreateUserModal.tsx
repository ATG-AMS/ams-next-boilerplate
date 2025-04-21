// src/app/_component/CreateUserModal.tsx

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/app/user/_libs/userSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

interface Props {
  onClose: () => void;
}

type FormValues = z.infer<typeof userSchema>;

export const CreateUserModal = ({ onClose }: Props) => {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error?.email) {
          setServerError({ email: result.error.email });
        }
        throw new Error('사용자 생성 실패');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('사용자 수동 생성 완료!');
      onClose(); // 모달 닫기
    },
    onError: () => {
      toast.error('사용자 생성 중 오류가 발생했습니다.');
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          👤 사용자 수동 생성
        </h2>

        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            setServerError({});
            mutation.mutate(data);
          })}
        >
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <input
              {...register('name')}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="홍길동"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              {...register('email')}
              className={clsx(
                'w-full mt-1 px-4 py-2 border rounded-md focus:ring-2',
                serverError.email || errors.email
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-indigo-500'
              )}
              placeholder="user@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            {serverError.email && (
              <p className="text-red-500 text-sm mt-1">{serverError.email}</p>
            )}
          </div>

          {/* 나이 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">나이</label>
            <input
              {...register('age', { valueAsNumber: true })}
              type="number"
              placeholder="30"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
