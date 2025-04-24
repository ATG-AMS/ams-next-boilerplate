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

  const handleSubmit = (e: React.FormEvent, reset: boolean = false) => {
    e.preventDefault();

    if (reset) {
      setName('');
      setEmail('');
      setAge('');
    }

    const params = reset
      ? { name: '', email: '', age: '' }
      : { name: name, email: email, age: age }

    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit}
      className={cn("flex items-center justify-between gap-8 flex-wrap", className)}>

      {/* 검색 필드 섹션 */}
      <div className="flex gap-6 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={name}
            placeholder="이름 입력"
            className="w-[140px] bg-gray-200 shadow-2xl"
            onChange={(e) => { setName(e.target.value); }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            value={email}
            placeholder="이메일 입력"
            className="w-[250px] bg-gray-200 shadow-2xl"
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
            className="w-[100px] bg-gray-200 shadow-2xl"
            onChange={(e) => { setAge(e.target.value); }}
          />
        </div>
      </div>

      {/* 버튼 섹션 */}
      <div className="flex gap-3">
        <Button variant="ghost" type="submit" className="rounded-lg">검색</Button>
        <Button
          variant="ghost"
          type="button"
          className="rounded-lg"
          onClick={(e) => {
            handleSubmit(e as React.FormEvent, true);
          }}
        >
          검색 초기화
        </Button>
      </div>
    </form>
  );
};