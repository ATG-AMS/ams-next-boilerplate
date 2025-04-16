// src/app/onboarding/hsh/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import OnboardingHSH from '@/components/OnboardingHSH';

const Page = () => {
  const router = useRouter();

  return (
    <main
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <OnboardingHSH onLoginClick={() => router.push('/onboarding/hsh/login')} />
    </main>
  );
};

export default Page;
