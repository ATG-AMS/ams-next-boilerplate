import { User } from "../../api/user/route";

type UserCardProps = {
  user: User | null;
  onClose: () => void;
};

export default function UserCard({ user, onClose }: UserCardProps) {
//export default function UserCard(props : {user : User | null; onClose: () => void})
  if (!user) return <div>유저 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="relative p-6 bg-white border rounded-2xl shadow-lg max-w-lg mx-auto my-4">
      <div className="flex items-center space-x-6">
        <div className="bg-blue-500 text-white p-2 rounded-full w-20 h-20 flex items-center justify-center text-2xl font-semibold shrink-0">
          {user.name[0]}
        </div>

        <div className="flex flex-col space-y-1">
          <p className="text-xl font-semibold">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone}</p>
          <p className="text-gray-600">{user.age}세 · {user.birthDate}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-[88%] left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shadow-md transition"
      >
        &times;
      </button>
    </div>
  );
}