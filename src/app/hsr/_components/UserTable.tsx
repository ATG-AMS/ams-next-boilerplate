'use client';

import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";

import {
  Table, TableHeader,
  TableBody, TableRow,
  TableHead, TableCell,
  TableCaption,
} from '@/components/atoms/Table';

import { User } from "../../api/user/route"
import UserCard from "../../hsr/_components/UserCard";

export default function UserTable() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const fetchUserList = async () => {
    const res = await fetch("api/user/");
    if (!res.ok) throw new Error("서버 응답 실패");
    return res.json();
  };

  const fetchUserById = async (id: string) => {
    const res = await fetch(`api/user/${id}`);
    if (!res.ok) throw new Error("서버 응답 실패");
    return res.json();
  }

  //(단순 fetch로) 화면에 이미 있는 user data로 만들 수 있지만, API routes를 익히는 단계이니 한 번 더 호출함
  // const fetchUserById = async (id: string) => {
  //   try {
  //     const res = await fetch(`api/user/${id}`);
  //     if (!res.ok) throw new Error("서버 응답 실패");
  //     // const data = await fetchC({ endpoint: `user/${id}` });
  //     setUserInfo(await res.json());
  //   } catch (err) {
  //     console.error("사용자 상세 정보 불러오기 실패:", err);
  //   }
  // };


  const { data: userList, isLoading: userListLoading, error: userListError } = useQuery<User[]>({
    queryKey: ['userList'],
    queryFn: () => fetchUserList(),
  });

  const { data: userInfo, isLoading: userInfoLoading } = useQuery({
    queryKey: ['userInfo', selectedUserId],
    queryFn: () => fetchUserById(selectedUserId),
    enabled: !!selectedUserId,
  });

  const handleUserClick = (id: string) => {
    setSelectedUserId(id);
  };

  const closeUserCard = () => {
    setSelectedUserId('');
  };

  if (userListLoading) {
    return <div className="text-center">사용자 목록 로딩중...</div>;
  }

  if (userListError) {
    return <div className="text-center text-red-500">사용자 목록 로딩 실패</div>;
  }

   return (
    <div className="flex flex-col items-center">
      <Table className="text-black my-4 w-full">
        <TableCaption className="text-lg font-bold">사용자 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">번호</TableHead>
            <TableHead className="font-bold">이름</TableHead>
            <TableHead className="font-bold">이메일</TableHead>
            <TableHead className="font-bold">나이</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList && userList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-6 italic">
                데이터가 존재하지 않습니다.
              </TableCell>
            </TableRow>
          ) : (
            userList?.map((user) => (
              <TableRow key={user.id} className="hover:bg-white cursor-pointer" onClick={() => handleUserClick(String(user.id))}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.age}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 사용자 카드 표시 */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl animate-fade-in">
            {userInfoLoading ? (
              <div className="text-center">로딩중...</div>
            ) : userInfo ? (
              <UserCard user={userInfo} onClose={closeUserCard} />
            ) : (
              <div className="text-center text-red-500">사용자 정보를 불러오는 데 실패했습니다.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}