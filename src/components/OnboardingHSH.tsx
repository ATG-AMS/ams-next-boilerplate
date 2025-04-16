  import Button from '@/components/ui/Button';

  type Props = {
    onLoginClick: () => void;
  };

  const OnboardingHSH = ({ onLoginClick }: Props) => {
    return (
      <div
        style={{
          fontFamily: 'Pretendard, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <h1 style={{ fontSize: 48, marginBottom: 40 }}>HSH</h1>
        <Button text="로그인" onClick={onLoginClick} />
      </div>
    );
  };

  export default OnboardingHSH;
