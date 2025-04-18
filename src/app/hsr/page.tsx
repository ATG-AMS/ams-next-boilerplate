import Counter from './_components/Counter';
import InfoForm from './_components/InfoForm';
import UserTable from './_components/UserTable';

export default function MainPage() {
  return (
    <>
      <div className="bg-blue-100 border border-blue-500 text-blue-900 shadow-md p-4 text-xl font-semibold">
        250415_useState 활용하여 간단한 컴포넌트를 생성
      </div>

      <div className="flex h-screen">
        <Counter />
        <InfoForm />
      </div>

      <div className="bg-blue-100 border border-blue-500 text-blue-900 shadow-md p-4 text-xl font-semibold">
        250416_API Routes와 UseEffect 활용하여, 받아온 Data로 컴포넌트를 생성
      </div>
      <UserTable />
    </>
  );
}