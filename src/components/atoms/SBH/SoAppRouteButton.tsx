'use client';

import { useRouter } from 'next/navigation';
import {Button,buttonVariants} from '@/components/atoms//Button';
//인라인 핸들러 패턴 : JSX 안에서 직접 onClick={() => ...} 정의
export default function SoButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/so');
  };
  return (
    <>
      <Button onClick={handleClick}>
        콜백 전달 방식
      </Button>
      <Button onClick={() => router.push('/so')}>
        인라인 전달 방식 
      </Button>
    </>
  );
}

// export default function getTabledata({data}:{data:string}){
//   return 
// }