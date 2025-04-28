import React, { useState } from 'react';

import { Label } from '@/components/atoms/Label';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  onSearch: (filter: { name: string; email: string; age: string; }) => void;
};

export const UserSearchBar = ({ className, onSearch }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ name, email, age });
  };
  
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setName('');
    setEmail('');
    setAge('');
    onSearch({ name: '', email: '', age: '' });
  };

  return (
    <form onSubmit={handleSubmit}
      className={cn("flex items-center justify-between gap-2 flex-wrap", className)}>

      {/* 검색 필드 섹션 */}
      <div className="flex gap-5 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={name}
            placeholder="이름 입력"
            className="w-[120px] bg-gray-200 shadow-2xl dark:text-black"
            onChange={(e) => { setName(e.target.value); }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            value={email}
            placeholder="이메일 입력"
            className="w-[200px] bg-gray-200 shadow-2xl dark:text-black"
            onChange={(e) => { setEmail(e.target.value); }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="age">나이</Label>
          <Input
            id="age"
            value={age}
            type="number"
            placeholder="나이 입력"
            className="w-[100px] bg-gray-200 shadow-2xl dark:text-black"
            onChange={(e) => { setAge(e.target.value); }}
          />
        </div>
      </div>

      {/* 버튼 섹션 */}
      <div className="flex">
        <Button variant="ghost" type="submit" className="rounded-lg">검색</Button>
        <Button
          variant="ghost"
          type="button"
          className="rounded-lg"
          onClick={(e) => {
            handleReset(e as React.FormEvent);
          }}
        >
          검색 초기화
        </Button>
      </div>
    </form>
  );
};