import { SampleTable } from '@/components/ui/SampleTable';
import { prisma } from '@/lib/prisma';
import { UserManagePage } from './_component/user-manage';

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
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <h1>사용자 관리</h1>
        <div className="w-full grow" id="user-manage-table-wrapper">
          <UserManagePage />
        </div>
    </main>
  );
};

export default ManageUsers;