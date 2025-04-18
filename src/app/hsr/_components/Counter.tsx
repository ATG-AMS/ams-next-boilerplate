'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';

export default function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log(`현재 카운트: ${count}`);
    }, [count]);

    const goBack = () => {
        window.history.back();
    };

    function increaseFive() {
        // setCount(count + 5);
        setCount(prev => prev + 5);
    }

    function decreaseFive() {
        setCount(prev => {
            const next = prev - 5;
            return next < 0 ? 0 : next;
        });
    }

    return (
        <>
            <div className="w-1/2 bg-white text-black flex flex-col items-center justify-center gap-10">
                <h1 className="text-3xl font-black">현재 카운트: {count}</h1>

                <div className="flex flex-row gap-7">
                    <Button onClick={() => setCount(count + 1)}>1씩 증가</Button>
                    <Button onClick={() => { increaseFive() }}>5씩 증가</Button>
                    <Button onClick={() => {
                        if (count > 0) {
                            setCount(count - 1);
                        }
                    }}>1씩 감소</Button>
                    <Button onClick={() => { decreaseFive() }} >5씩 감소</Button>
                    <Button onClick={() => setCount(0)}>초기화</Button>
                </div>

                <Button onClick={goBack} variant="link">
                    뒤로 가기
                </Button>
            </div>
        </>
    );
}