import { SampleTable } from '@/components/ui/SampleTable';
import { prisma } from '@/lib/prisma';
import { UserManagePage } from './_component/user-manage';
import './_style/users.css';

const ManageUsers = async () => {
  const userData = await prisma.user
    .findMany({
      skip: 0,
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    })
    .then(async (users) => {
      const count = await prisma.user.count();
      return { rows: users, count };
    });

  return (
    <div id="user-table-page">
      <h1 className="mb-4 text-3xl font-bold">
        📝 사용자 정보 열람 및 관리하기
      </h1>
      <div className="mt-4 grid size-full justify-items-center gap-4">
        <UserManagePage />
      </div>
    </div>
  );
};

export default ManageUsers;
