'use client';

import { useEffect, useState } from 'react';
import {Input} from '@/components/atoms/Input';
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  } from "@/components/atoms/Table";

export default function TestApi() {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(5); // 생성할 유저 수 입력값

  const [userId, setUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null); // 선택된 유저 정보 저장


    // const handleUserDetailFetch = async () => {
    //   if (userId === "") return;

    //   const res = await fetch(`/api/sbh/${userId}`);
    //   if (!res.ok) {
    //       alert("유저를 찾을 수 없습니다.");
    //       return;
    //   }

    //   const user = await res.json();
    //   alert(`${user.name}님의 정보\n이메일: ${user.email}\n나이: ${user.age}`);
    // };

  const fetchData = async () => {
    const res = await fetch(`/api/user?amount=${num}`); // amount 파라미터로 요청
    const data = await res.json();
    setUsers(data.rows);
    setCount(data.count);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (userId === '') return;
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) {
        setSelectedUser(null);
        return;
      }
      const user = await res.json();
      setSelectedUser(user);
    };

    fetchUserDetail();
  }, [userId]);

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="font-bold text-lg mb-2">총 유저 수: {count}</h2>
      <div className="flex gap-2 items-center">
        <input
          className="w-24 bg-gray-200 shadow-2xl dark:bg-transparent"
          type="number"
          value={num}
          onChange={(e) => setNum(Number(e.target.value))}
          placeholder="생성할 유저 수"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={fetchData}
        >
          유저 생성 및 조회
        </button>
      </div>
      <Table>
        <TableHeader>
        <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>나이</TableHead>
            <TableHead>방문 수</TableHead>
            <TableHead>진행률</TableHead>
            <TableHead>상태</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        {users.map((user: any, index: number) => (
            <TableRow key={index}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.age}</TableCell>
            <TableCell>{user.visits}</TableCell>
            <TableCell>{user.progress}%</TableCell>
            <TableCell>{user.status}</TableCell>
            </TableRow>
        ))}
        </TableBody>
    </Table>
    {/* <Input
        className="w-36"
        type="number"
        placeholder="조회할 ID 입력 (예: 0)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
    />
    <button
        className="px-4 py-2 bg-purple-600 text-white rounded"
        onClick={handleUserDetailFetch}
    >
        유저 상세 조회
    </button> */}
    {/* 유저 ID 입력 */}
    <Input
        className="w-36"
        type="number"
        placeholder="조회할 ID 입력 (예: 0)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      {/* 선택된 유저 정보 출력 */}
      {selectedUser && (
        <div className="mt-4 border rounded p-4 bg-gray-50 dark:bg-slate-800">
          <h3 className="font-bold text-lg mb-2">📋 유저 상세 정보</h3>
          <p>이름: {selectedUser.name}</p>
          <p>이메일: {selectedUser.email}</p>
          <p>나이: {selectedUser.age}</p>
          <p>방문 수: {selectedUser.visits}</p>
          <p>진행률: {selectedUser.progress}%</p>
          <p>상태: {selectedUser.status}</p>
        </div>
      )}
    </div>
    
  );
}
