// src/app/users/[idx]/page.tsx

import { notFound } from "next/navigation";
import UserInfo from "@/components/UserInfo";

type Props = {
  params: {
    idx: string;
  };
};

export default function UserDetailPage({ params }: Props) {
  const idxParsed = parseInt(params.idx, 10);

  if (isNaN(idxParsed)) {
    return notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">사용자 상세 정보</h1>
      <UserInfo idx={idxParsed} />
    </div>
  );
}
