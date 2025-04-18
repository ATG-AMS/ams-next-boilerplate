'use client';

import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";

import {
  Table, TableHeader,
  TableBody, TableRow,
  TableHead, TableCell,
  TableCaption,
} from '@/components/atoms/Table';
import { fetchC } from "@/lib/utils";

import { User } from "../../api/user/route"
import UserCard from "../../hsr/_components/UserCard";

export default function UserTable() {
  const [userList, setUserList] = useState<User[] | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const fetchUserData = async () => {
    try {
      // const data = await fetchC({ endpoint: "user" }); //fetchC에서 default method가 get
      const res = await fetch("api/user/");
      if (!res.ok) throw new Error("서버 응답 실패");

      setUserList(await res.json());
    } catch (err) {
      console.error("사용자 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  //화면에 이미 있는 user data로 만들 수 있지만, API routes를 익히는 단계이니 한 번 더 호출함
  const fetchUserById = async (id: string) => {
    try {
      const res = await fetch(`api/user/${id}`);
      if (!res.ok) throw new Error("서버 응답 실패");
      // const data = await fetchC({ endpoint: `user/${id}` });
      setUserInfo(await res.json());
    } catch (err) {
      console.error("사용자 상세 정보 불러오기 실패:", err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Table className="text-black my-4">
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
          {userList === null ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-6 italic">
                데이터가 존재하지 않습니다.
              </TableCell>
            </TableRow>
          ) : (
            userList.map((user) => (
              <TableRow key={user.id} className="hover:bg-white">
                <TableCell>{user.id}</TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => fetchUserById(String(user.id))}
                >{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.age}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {userInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl animate-fade-in">
            <UserCard user={userInfo} onClose={() => setUserInfo(null)} />
          </div>
        </div>
      )}
    </div>
  );
}