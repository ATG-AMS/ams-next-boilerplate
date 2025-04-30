import React, { useState } from 'react';
import { useRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';

import { Label } from '@/components/atoms/Label';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { sampleTableState } from '@/components/store/SampleTableState';
import { inputValueState } from '@/components/store/InputValueState';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const UserSearchBar = ({ className }: Props) => {
  const [tableState, setTableState] = useRecoilState(sampleTableState);
  const [inputValues, setInputValues] = useRecoilState(inputValueState); 
  const resetInputValues = useResetRecoilState(inputValueState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isFilter = !(inputValues.name === '' && inputValues.email === '' && inputValues.age === '');
   
    setTableState((prev) => ({
      ...prev,
      pageIndex: 0,
      searchParams: {
        name: inputValues.name,
        email: inputValues.email,
        age: inputValues.age,
      },
      isFilter: isFilter
    }));
  };
  
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    resetInputValues();
    setTableState((prev) => ({
      ...prev,
      pageIndex: 0,
      searchParams: {
        name: '',
        email: '',
        age: '',
      },
      isFilter: false
    }));
  };

  return (
    <form onSubmit={handleSubmit}
      className={cn("flex items-center justify-between gap-3 flex-wrap", className)}>

      {/* 검색 필드 섹션 */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={inputValues.name}
            placeholder="이름 입력"
            className="w-[130px] bg-gray-200 shadow-2xl dark:text-black"
            onChange={(e) => setInputValues((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            value={inputValues.email}
            placeholder="이메일 입력"
            className="w-[230px] bg-gray-200 shadow-2xl dark:text-black"
            onChange={(e) => setInputValues((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="age">나이</Label>
          <Input
            id="age"
            value={inputValues.age}
            type="number"
            placeholder="나이 입력"
            className="w-[100px] bg-gray-200 shadow-2xl dark:text-black"
            onChange={(e) => setInputValues((prev) => ({ ...prev, age: e.target.value }))}
          />
        </div>
      </div>

      {/* 버튼 섹션 */}
      <div className="flex gap-1">
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