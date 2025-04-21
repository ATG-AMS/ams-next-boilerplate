// src/app/user/[idx]/_components/UserInfo.tsx

// 방법1: useEffect 와 fetch 를 사용
// 'use client';

// import { useEffect, useState } from 'react';

// type User = {
//   idx: number;
//   name: string;
//   email: string;
//   age: number;
//   createdAt: string;
// };

// export default function UserInfo({ idx }: { idx: number }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch(`/api/users/${idx}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.error) {
//           setError(data.error);
//         } else {
//           setUser(data);
//         }
//       })
//       .catch(() => {
//         setError("요청 중 오류가 발생했습니다.");
//       });
//   }, [idx]);

//   if (error) return <p className="text-red-500">⚠ {error}</p>;
//   if (!user) return <p>정보를 불러오는 중...</p>;

//   return (
//     <div className="p-4 border rounded-md">
//       <h2 className="text-xl font-semibold mb-2">{user.name} 님의 프로필</h2>
//       <p><strong>이름:</strong> {user.name}</p>
//       <p><strong>이메일:</strong> {user.email}</p>
//       <p><strong>나이:</strong> {user.age}</p>
//       <p><strong>가입일:</strong> {new Date(user.createdAt).toLocaleString()}</p>
//     </div>
//   );
// }

// src/app/user/[idx]/_components/UserInfo.tsx
// 방법2: useQuery 를 사용

'use client';

import { useQuery } from '@tanstack/react-query';

type User = {
  idx: number;
  name: string;
  email: string;
  age: number;
  createdAt: string;
};

async function fetchUser(idx: number): Promise<User> {
  const res = await fetch(`/api/users/${idx}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || '알 수 없는 오류');
  }

  return data;
}

export default function UserInfo({ idx }: { idx: number }) {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user', idx],
    queryFn: () => fetchUser(idx),
  });

  if (isLoading) return <p>정보를 불러오는 중...</p>;
  if (error) return <p className="text-red-500">⚠ {error.message}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">{user!.name} 님의 프로필</h2>
      <p className="mb-1"><strong>이름:</strong> {user!.name}</p>
      <p className="mb-1"><strong>이메일:</strong> {user!.email}</p>
      <p className="mb-1"><strong>나이:</strong> {user!.age}</p>
      <p className="mb-1"><strong>가입일:</strong> {new Date(user!.createdAt).toLocaleString()}</p>
    </div>
  );
}

