'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';

export default function InfoForm() {
  const initialInfo = {
    name: '',
    age: '',
    email: '',
  };

  const [info, setInfo] = useState(initialInfo);

  function changedText(e: React.ChangeEvent<HTMLInputElement>) {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <>
      <div className="flex w-1/2 flex-col items-center justify-center gap-6 bg-black text-white">
        <div className="flex items-center gap-2">
          <label className="mr-2 font-bold">이름</label>
          <input
            name="name"
            value={info.name}
            onChange={(e) => changedText(e)}
            className="h-8 rounded border-2 border-gray-300 text-sm text-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="mr-2 font-bold">나이</label>
          <input
            name="age"
            value={info.age}
            onChange={(e) => changedText(e)}
            className="h-8 rounded border-2 border-gray-300 text-sm text-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="mr-2 font-bold">이메일</label>
          <input
            name="email"
            value={info.email}
            onChange={(e) => changedText(e)}
            className="h-8 w-80 rounded border-2 border-gray-300 text-sm text-black"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <p>입력한 이름: {info.name}</p>
          <p>입력한 나이: {info.age}</p>
          <p>입력한 이메일: {info.email}</p>
        </div>

        <Button variant="outline" onClick={() => setInfo(initialInfo)}>
          초기화
        </Button>
      </div>
    </>
  );
}
