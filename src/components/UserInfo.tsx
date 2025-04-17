// src/components/UserInfo.tsx

'use client';

import { useEffect, useState } from 'react';

type User = {
  idx: number;
  name: string;
  email: string;
  age: number;
  createdAt: string;
};

export default function UserInfo({ idx }: { idx: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/users/${idx}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setUser(data);
        }
      })
      .catch(() => {
        setError("요청 중 오류가 발생했습니다.");
      });
  }, [idx]);

  if (error) return <p className="text-red-500">⚠ {error}</p>;
  if (!user) return <p>불러오는 중...</p>;

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-semibold mb-2">{user.name} 님의 정보 입니다.</h2>
      <p><strong>이름:</strong> {user.name}</p>
      <p><strong>이메일:</strong> {user.email}</p>
      <p><strong>나이:</strong> {user.age}</p>
      <p><strong>가입일:</strong> {new Date(user.createdAt).toLocaleString()}</p>
    </div>
  );
}
