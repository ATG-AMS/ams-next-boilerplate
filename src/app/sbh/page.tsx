import Greeting from '@/app/sbh/_components/Greeting';
import SoStatePage from '@/app/sbh/_components/SoState'
import TestApi from '@/app/sbh/_components/TestApi';

export default function SoPage() {
    return (
      <>
        <SoStatePage />
        <TestApi/>
        {/* <div>
            <h1><Greeting data="gk" />페이지입니다!</h1>
        </div>
         */}
      </>
    );
  }