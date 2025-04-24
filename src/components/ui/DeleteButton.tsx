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
    const { refetch } = useRecoilValue(sampleTableState); // recoil로 받은 refetch 함수

    const queryClient=useQueryClient();
    const id = user.idx
    const { mutate } = useMutation({
        mutationFn: async () => {
            const res= await fetch(`/api/users/${id}`, {
                    method: 'DELETE' 
            });
            if (!res.ok) {
                throw new Error('삭제 실패');
            }
        },
        onSuccess: () => {
            refetch();
            // queryClient.invalidateQueries({
            //     predicate: (query) => {
            //       const key = query.queryKey?.[0] as { endpoint?: string };
            //       return key?.endpoint === 'users';
            //     },
            //   });
        },
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
  
// 2. 선택 삭제 + 전체 삭제 버튼 툴바 (페이지 상단 툴바 또는 테이블 위쪽)
export const PageDeleteToolbar = ({ selectedIds }: { selectedIds: number[] }) => {
const queryClient=useQueryClient();


const { mutate: deleteSelected } = useMutation({
    mutationFn: async () => {
    return await fetch(`/api/users/bulk-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
    });
    },
    onSuccess: () => {
    queryClient.invalidateQueries({queryKey:['users']});
    },
});

const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    deleteSelected();
};

return (
    <div className="flex gap-2">
    <Button onClick={handleDeleteSelected} disabled={selectedIds.length === 0}>
        선택 삭제
    </Button>
    <FullDeleteButton />
    </div>
);
};
  
  // 3. 전체 삭제 버튼 (별도 분리 가능)
export const FullDeleteButton = () => {

    const queryClient=useQueryClient();


const { mutate } = useMutation({
    mutationFn: async () => {
    return await fetch(`/api/users`, { method: 'DELETE' });
    },
    onSuccess: () => {
    queryClient.invalidateQueries({queryKey:['users']});
    },
});

return (
    <Button variant="destructive" onClick={() => mutate()}>
    전체 삭제
    </Button>
);
};
