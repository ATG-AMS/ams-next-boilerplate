import Counter from './_components/Counter';
import InfoForm from './_components/InfoForm';
import UserTable from './_components/UserTable';

export default function MainPage() {
  return (
    <>
      <div className="border border-blue-500 bg-blue-100 p-4 text-xl font-semibold text-blue-900 shadow-md">
        Mission#1_useState 활용하여 간단한 컴포넌트를 생성
      </div>

      <div className="flex h-screen">
        <Counter />
        <InfoForm />
      </div>

      <div className="border border-blue-500 bg-blue-100 p-4 text-xl font-semibold text-blue-900 shadow-md">
        Mission#2_API Routes와 UseEffect 활용하여, 받아온 Data로 컴포넌트를 생성
      </div>
      <UserTable />

      <div className="border border-blue-500 bg-blue-100 p-4 text-xl font-semibold text-blue-900 shadow-md">
        Mission#3_form 생성
      </div>
      <div className="p-4 text-lg font-medium text-gray-500">
        메인페이지에 작성
      </div>
    </>
  );
}
