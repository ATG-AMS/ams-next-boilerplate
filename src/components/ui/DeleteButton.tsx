'use client'; // React Client 컴포넌트 임을 명시

import { MdDeleteOutline } from 'react-icons/md';
import { Button } from '@/components/atoms/Button';
import { useMutation,useQueryClient } from '@tanstack/react-query';

import { User } from '@prisma/client';
import { sampleTableState } from '../store/SampleTableState';
import { useRecoilValue } from 'recoil';



// 삭제 관련 컴포넌트 분리 구조 (초안)

// 1. 행 삭제 버튼 (각 row 내부)
export const DeleteButton = ({ user }: { user: User }) => {

    const queryClient=useQueryClient();
    const { mutate } = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/users', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idx: user.idx }), // ✅ id → body로 전달
            });
      
            if (!res.ok) {
              throw new Error('삭제 실패');
            }
          },
          onSuccess: () => {
            queryClient.invalidateQueries({
              //['users', *]로 시작하는 모든 queryKey에 대해 무효화(invalidate) 동작을 수행
              //invalidate 이후 삭제를 한 페이지의 정보로 refetch 재실행(재요청)
              queryKey: ['users']
            });
          }
    });

    return (
    <Button
        onClick={() => mutate()}
        variant="ghost"
        className="hover:bg-red-100 text-red-600"
        >
        <MdDeleteOutline size={18} />
        </Button>
    );
};
  