'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { faker } from "@faker-js/faker";
import { Person } from '@/lib/makeData';
import { z } from 'zod';

// Zod 스키마 정의
const personSchema = z.object({
  name: z.string().min(2, '2자 이상 입력하세요!').max(10, '이름은 최대 10자까지 가능합니다'),
  email: z.string().email('올바른 도메인을 입력하세요'),
  age: z.number().min(1, '나이는 1세 이상이어야 합니다').max(120, '나이는 120세 이하이어야 합니다').optional(),
});

// Zod 스키마 기반 타입 추출
type ZodFormInput = z.infer<typeof personSchema>;

interface SBHModalProps {
  onClose: () => void;
}

export default function SBHModal({ onClose }: SBHModalProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ZodFormInput>({ mode: 'onBlur', resolver: zodResolver(personSchema) });

  const handleUserSubmit = async (data: ZodFormInput) => {
    const newUser: Person = {
      name: data.name,
      email: data.email,
      age: data.age,
      visits: faker.number.int(1000),
      progress: faker.number.int(100),
      status: faker.helpers.shuffle<Person['status']>(["relationship", "complicated", "single"])[0]!,
    };
    console.log('유저 정보 제출됨:', newUser);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();
      console.log('서버 응답:', result);

      onClose();
    } catch (err) {
      console.error('에러 발생:', err);
      alert('유저 생성에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 text-black">
        <h2 className="text-xl font-bold mb-4">유저 수동 생성</h2>

        <form onSubmit={handleSubmit(handleUserSubmit)} className="space-y-4">
          <div>
            <Input placeholder="이름" {...register('name')} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <Input placeholder="이메일" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message as string}</p>
            )}
          </div>

          <div>
            <Input placeholder="나이 (선택)" type="number" {...register('age', { valueAsNumber: true })} />
            {errors.age && (
              <p className="text-red-500 text-sm">{errors.age.message as string}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit">제출</Button>
            <Button type="button" variant="outline" onClick={onClose}>닫기</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
