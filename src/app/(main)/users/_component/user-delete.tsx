'use client';

import type { User } from '../_interface/users-interface';
import { useDeleteUser } from '../_action/user-data-query';
import { MdDeleteOutline } from 'react-icons/md';

export const UserDeleteButton = ({ user }: { user: User }) => {
  const { mutateAsync: deleteUser } = useDeleteUser();
  return (
    <MdDeleteOutline
      className={'cursor-pointer text-red-500 transition-all hover:ease-in-out'}
      size={20}
      onClick={() => {
        if (confirm(`정말로 ${user.name}님을 삭제하시겠습니까?`)) {
          deleteUser(user.idx)
            .then(() => {
              alert('삭제가 완료되었습니다.');
            })
            .catch((error) => {
              console.error('삭제 중 오류 발생:', error);
              alert('삭제 중 오류가 발생했습니다.');
            });
        }
      }}
    />
  );
};
