'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useForm,UseFormReturn } from 'react-hook-form';
import { useState, } from 'react';
import { faker } from "@faker-js/faker";
import { Person } from '@/lib/makeData';
import { useQuery } from '@tanstack/react-query';

/**
 * SBHModal 컴포넌트에서 받아올 props 타입 정의
 * @property onClose - 닫기 버튼 클릭 시 실행할 콜백 함수
 */
interface SBHModalProps {
  onClose: () => void;
}



/**
 * 유저 수동 생성 모달 컴포넌트
 * @component
 * @param {SBHModalProps} props - 모달에서 사용할 props 객체
 * @returns {JSX.Element} 모달 UI
 */
export default function SBHModal({ onClose }: SBHModalProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Person>({mode:'onBlur'}); //기본 useForm 사용


  const handleUserSubmit = async(data: any) => {
    const newUser:Person={
      name: data.name,
      email: data.email,
      age: data.age,
      visits: faker.number.int(1000),
      progress: faker.number.int(100),
      status: faker.helpers.shuffle<Person['status']>(["relationship", "complicated", "single"])[0]!,
    }
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
    
        onClose(); // 성공 시 모달 닫기
      } catch (err) {
        console.error('에러 발생:', err);
        alert('유저 생성에 실패했습니다.');
      }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 text-black">
        <h2 className="text-xl font-bold mb-4">유저 수동 생성</h2>

        {/* 유저 입력 폼 */}
        <form onSubmit={handleSubmit(handleUserSubmit)} className="space-y-4">
          <div>
            <Input placeholder="이름" {...register('name', {
                required: '이름을 입력해주세요!' ,
                minLength: { value: 2, message: '2자 이상 입력하세요!' },
                maxLength: { value: 10, message: '이름은 최대 10자까지 가능합니다' }
            })} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <Input placeholder="이메일" type="email" {...register('email', {
                 required: '이메일은 필수입니다',
                 pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '올바른 도메인을 입력하세요',
                  }
                 })} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message as string}</p>
            )}
          </div>

          <div>
            <Input placeholder="나이 (선택)" type="number" {...register('age',{
                valueAsNumber:true,
                min: { value: 1, message: '나이는 1세 이상이어야 합니다' },
                max: { value: 120, message: '나이는 120세 이하이어야 합니다' }
                })} />
            {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message as string}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit">제출</Button>
            
             {/* 닫기 버튼 클릭 시 상위에서 전달된 onClose 콜백 실행 */}
            <Button type="button" variant="outline" onClick={onClose}>닫기</Button>
            
          </div>
        </form>
      </div>
    </div>
  );
}

                    

               
