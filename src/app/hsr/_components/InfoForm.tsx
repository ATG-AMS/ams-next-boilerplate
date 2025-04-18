'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';

export default function InfoForm() {
    const initialInfo = {
        name: "",
        age: "",
        email: ""
    };

    const [info, setInfo] = useState(initialInfo);

    function changedText(e: React.ChangeEvent<HTMLInputElement>, param: string) {
        setInfo({
            ...info,
            [param]: e.target.value
        })
    };

    return (
        <>
            <div className="w-1/2 bg-black text-white flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                    <label className="mr-2 font-bold">이름</label>
                    <input
                        value={info.name}
                        onChange={(e) => changedText(e, 'name')}
                        className="border-2 border-gray-300 rounded text-black text-sm h-8"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="mr-2 font-bold">나이</label>
                    <input
                        value={info.age}
                        onChange={(e) => changedText(e, 'age')}
                        className="border-2 border-gray-300 rounded text-black text-sm h-8"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="mr-2 font-bold">이메일</label>
                    <input
                        value={info.email}
                        onChange={(e) => changedText(e, 'email')}
                        className="border-2 border-gray-300 rounded text-black text-sm h-8 w-80"
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