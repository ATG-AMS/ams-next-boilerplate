import React from 'react';
import './_style/user-info.css';
import UserInfoWithEmail from './_component/user-info-email';
import UserInfoWithIdx from './_component/user-info-idx';

export const UserInfoPage: React.FC = () => {
  return (
    <div
      className="flex size-full flex-col items-center justify-center"
      id="user-info-page"
    >
      <h1 className="mb-4 text-3xl font-bold">🔍 사용자 정보 조회하기</h1>
      <p>
        아래 컴포넌트에서 이메일로 사용자를 검색하거나, 내부 인덱스값 (
        <code className="inline">idx</code>)으로 사용자를 검색할 수 있습니다. 둘
        다 모르는 경우, 우선 이름으로 이메일을 검색해보세요.
      </p>
      <div className="mt-4 grid size-full grid-cols-2 justify-items-center gap-4">
        <UserInfoWithEmail />
        <UserInfoWithIdx />
      </div>
    </div>
  );
};

export default UserInfoPage;
