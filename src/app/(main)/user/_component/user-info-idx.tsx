'use client';

/*
 * 이 코드는 사용자 정보를 인덱스값(`idx`)으로 조회하는 컴포넌트입니다.
 * 사용자가 인덱스값을 입력하고 검색 버튼을 클릭하면 해당 인덱스값에 대한 사용자 정보를 가져옵니다.
 */

// #0. 모듈/타입 Import
// #0-1. React 기본 제공
import React, { useState, useEffect } from 'react';
// #0-2. 타 라이브러리
// #0-3. 공통 컴포넌트
import { Input } from '@/components/atoms/Input';
// #0-4. 이 페이지에서만 사용하는 컴포넌트
import { type User } from '../_interface/user-interface';

export const UserInfoWithIdx: React.FC = () => {
  // #1. 컴포넌트 내에서 사용할 변수, 상태 등의 정의
  const [idx, setIdx] = useState<number | ''>('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // #2. 서버 상호작용 메서드 이벤트 핸들러 정의
  const handleSearch = async () => {
    if (idx === '' || idx <= 0) {
      setError('유효한 인덱스값(자연수)를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/user-idx/${idx}`);
      if (!res.ok) {
        if (res.status === 404) {
          setUser(null);
          setError('해당 인덱스값을 가진 사용자가 없습니다.');
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } else {
        const fetched: User = await res.json();
        setUser(fetched);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '요청 도중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // #3. useEffect 훅 등의 정의
  useEffect(() => {
    if (idx !== '' && idx > 0) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]); // 인덱스값이 변경될 때마다 사용자 정보 새로 받아오기

  // #4. 컴포넌트 렌더링
  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        인덱스값으로 조회
      </h2>

      <div className="mb-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        인덱스값:
        <Input
          className="flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          min="1"
          type="number"
          value={idx}
          onChange={(e) => {
            const v = e.target.value;
            setIdx(v === '' ? '' : Math.max(1, Number(v)));
          }}
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {user ? (
        <div className="grid grid-cols-1 gap-4 divide-y divide-gray-200 rounded-lg bg-gray-50 p-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {[
            ['이름', user.name],
            ['이메일', user.email],
            ['나이', String(user.age) + '세'],
            ['방문 횟수', String(user.visits) + '회'],
            ['진행률', String(user.progress) + '%'],
            ['상태', user.status],
            [
              '가입일',
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : '정보 없음',
            ],
          ].map(([label, value]) => (
            <div key={label} className="border-none py-2">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-lg font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      ) : !isLoading && !error ? (
        <p className="text-center text-gray-500">
          인덱스값을 입력해주세요. (자동 검색)
        </p>
      ) : null}
    </div>
  );
};

export default UserInfoWithIdx;
