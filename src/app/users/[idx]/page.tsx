// src/app/users/[idx]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    idx: string;
  };
};

export default async function UserDetailPage({ params }: Props) {

  console.log('params.idx:', params.idx);

  const idxParsed = parseInt(params.idx, 10);
  console.log('Parsed idx:', idxParsed);

  if (isNaN(idxParsed)) {
    console.error('🚨 Invalid idx: not a number');
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      idx: idxParsed,
    },
  });

  console.log('Fetched user:', user);
  
  if (!user) return notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">사용자 상세 정보</h1>
      <div className="space-y-2">
        <p><strong>IDX:</strong> {user.idx}</p>
        <p><strong>이름:</strong> {user.name}</p>
        <p><strong>이메일:</strong> {user.email}</p>
        <p><strong>가입일:</strong> {user.createdAt.toLocaleString()}</p>
      </div>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';

// type User = {
//   idx: number;
//   name: string;
//   email: string;
//   age: number;
// };

// export default function UserInfo({ idx }: { idx: number }) {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     fetch(`/api/user/${idx}`)
//       .then((res) => res.json())
//       .then((data) => setUser(data));
//   }, [idx]);

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>User Info</h2>
//       <p>이름: {user.name}</p>
//       <p>이메일: {user.email}</p>
//       <p>나이: {user.age}</p>
//     </div>
//   );
// }

