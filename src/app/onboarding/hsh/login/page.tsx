// src/app/onboarding/hsh/login/page.tsx

'use client';

import OnboardingLogin from '@/components/OnboardingLogin';

const LoginPage = () => {
  return (
    <main
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <OnboardingLogin />
    </main>
  );
};

export default LoginPage;
