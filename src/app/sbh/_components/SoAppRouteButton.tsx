'use client';

import { useRouter } from 'next/navigation';
import {Button,buttonVariants} from '@/components/atoms/Button';
//인라인 핸들러 패턴 : JSX 안에서 직접 onClick={() => ...} 정의
export default function SBHButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/sbh');
  };
  
  const handleAPITest = async()=>{
    const res = await fetch('api/user')
    const data = await res.json();

    console.log("응답 데이터:", data); // ← 여기서 users 데이터 확인 가능
    const encoded = encodeURIComponent(JSON.stringify(data));
    router.push(`/sbh?data=${encoded}`)

  }
  return (
    <>
      <Button onClick={handleAPITest}>
        API ROUTE 테스트
      </Button>
      {/* 
      <Button onClick={handleClick}>
        콜백 전달 방식
      </Button>

      <Button onClick={() => router.push('/sbh')}>
        인라인 전달 방식 
      </Button> 
      */}
    </>
  );
}

// export default function getTabledata({data}:{data:string}){
//   return 
// }

