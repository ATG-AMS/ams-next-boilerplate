'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

const OnboardingLogin = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canLogin, setCanLogin] = useState(false);

  useEffect(() => {
    setCanLogin(name.trim().length >= 2);
  }, [name]);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        router.push('/onboarding/hsh');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, router]);

  const handleLogin = () => {
    if (!canLogin) {
      alert('이름을 2자 이상 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 1500);
  };

  return (
    <div
      style={{
        padding: 40,
        fontFamily: 'Pretendard, sans-serif',
        maxWidth: 500,
        margin: '0 auto',
        border: '1px solid #e5e5e5',
        borderRadius: '10px',
        backgroundColor: '#fafafa',
        marginTop: '100px',
      }}
    >
      {!isLoggedIn ? (
        <>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>로그인</h2>
          <input
            type="text"
            placeholder="이름을 입력하세요 (2자 이상)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: '20px',
              fontSize: '16px',
            }}
          />
          <Button text="로그인" onClick={handleLogin} />
          {isLoading && (
            <p style={{ marginTop: '20px', color: '#999' }}>로딩 중입니다...</p>
          )}
        </>
      ) : (
        <h2 style={{ marginTop: '20px' }}>환영합니다, {name}님! (3초 후 이동합니다)</h2>
      )}
    </div>
  );
};

export default OnboardingLogin;
