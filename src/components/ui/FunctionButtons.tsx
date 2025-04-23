'use client'; // React Client 컴포넌트 임을 명시

import { Button } from '@/components/atoms/Button';
import { cn, fetchC } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import type { Person } from '@/lib/makeData';
import { makeData } from '@/lib/makeData';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { sampleTableState } from '@/components/store/SampleTableState';
import SBHModal from '@/app/sbh/_components/SBHModal';
import {useQuery} from '@tanstack/react-query';




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
      <ResetButton className="border-r border-gray-400 rounded-none" refetch={refetch} syncState={resetToFirstPage} />
      <GenerateFormButton className="border-r border-gray-400 rounded-none" refetch={refetch} syncState={resetToFirstPage} />
      <GetDataDB className="ml-4"  refetch={refetch} syncState={resetToFirstPage} />
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



/**
 * 모달 열기 버튼 + 모달 제어 컴포넌트
 */
export const GenerateFormButton = ({ className, refetch, syncState }: Props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button 
        className={cn('text-lg shadow-none', className)}
        onClick={() => setShowModal(true)}>수동 생성</Button>
        {/*
          && 연산자는 short-circuit evaluation (단락 평가) 방식으로
          showModal이 true일 때만 뒤의 JSX(SBHModal)가 실행됨
        */}

      {showModal && (
        <SBHModal
          /**
           * 모달 컴포넌트에 닫기용 콜백 전달
           * → 닫기 버튼 클릭 시 setShowModal(false) 호출됨
           */
          refetch={refetch}           // ✅ 상위에서 전달받은 걸 그대로 SBHModal에 넘김
          syncState={syncState}  
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export const GetDataDB=({className}:Props)=>{

  const [userId, setUserId] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [fetchedUser, setFetchedUser] = useState<Person | null>(null);
  const {
    data: user,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) throw new Error('유저를 찾을 수 없습니다.');
      return res.json();
    },
    enabled: false, // 자동 실행 막기 useQuery는 기본적으로 컴포넌트가 렌더링될 때 실행되는데 이걸 막고, 우리가 원할 때(refetch)만 실행
  }); 

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim() === '') return;
    setEnabled(true);
    refetch();
  };


  const handleFetchSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) throw new Error('유저 없음');
      const user = await res.json();
      console.log("fetch 기반 응답", user);
      setFetchedUser(user); // ✅ 상태에 반영
      // 여기서 setUser(user) 등 상태 저장 가능
    } catch (err) {
      console.error('fetch 실패:', err);
      setFetchedUser(null); // 실패 시 초기화
    }
  };
  


  return (
    <form onSubmit={handleSearch} className={cn('flex items-center', className)}>
      <Label htmlFor="searchId" className="mr-2">
        조회할 것 :
      </Label>
      <Input
        id="searchId"
        className="w-32 bg-gray-200 shadow-2xl dark:bg-transparent"
        placeholder="ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <Button type="submit" className="text-lg shadow-none ml-2">
        조회
      </Button>

      {/* 결과 출력 */}
      {isFetching && <p className="ml-4 text-sm text-gray-500">조회 중...</p>}
      {isError && <p className="ml-4 text-sm text-red-500">유저를 찾을 수 없습니다.</p>}
      {user && (
        <div className="ml-4 text-sm text-gray-700">
          <p><strong>이름:</strong> {user.name}</p>
          <p><strong>이메일:</strong> {user.email}</p>
          <p><strong>나이:</strong> {user.age}</p>
        </div>
      )}
      {fetchedUser && (
        <div className="ml-4 text-sm text-gray-700">
          <p><strong>이름:</strong> {fetchedUser.name}</p>
          <p><strong>이메일:</strong> {fetchedUser.email}</p>
          <p><strong>나이:</strong> {fetchedUser.age}</p>
        </div>
      )}
    </form>
  );
  // return(
  //   <>
  //     <form className={cn('flex items-center ', className)}>
  //       <Label className="items-start" htmlFor="rows">
  //         조회할 것 :
  //       </Label>
  //       <Input
  //         className="w-24 bg-gray-200 shadow-2xl dark:bg-transparent"
  //         placeholder="ID혹은Email"
  //         onChange={(e) => setUserId(e.target.value)}
  //       />
  //       <Button
  //         className="text-lg shadow-none"
  //       >
  //         조회
  //       </Button>
  //     </form>
      
  //   </>
  // )



}


