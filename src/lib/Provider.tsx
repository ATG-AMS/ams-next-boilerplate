'use client'; // 클라이언트 측에서 사용되는 코드임을 명시

import type { ReactNode } from 'react';
import React from 'react';
/** recoil의 root 컴포넌트 */
import { RecoilRoot } from 'recoil';

/** react-query에서 필요한 QueryClient 및 Provider */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/** react-query의 개발 도구 */
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/** 유틸리티 함수와 타입 */
import type { ClientSideFetchOptions, RequestParams } from '@/lib/utils';
import { fetchC, parseRequestParams } from '@/lib/utils';

type Props = {
  children: ReactNode;
};

const Provider = ({ children }: Props) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async (context) => {
          const options: ClientSideFetchOptions = {
            endpoint: '',
            // token: token,
            ...(parseRequestParams(
              context.queryKey as Array<Partial<RequestParams>>
            ) as RequestParams),
          };
          return fetchC(options); // fetchC 함수를 사용하여 데이터를 가져옴
        },
      },
    },
  });

  // QueryClientProvider와 RecoilRoot를 통해 전역 상태와 데이터 쿼리 관련 컨텍스트를 제공합니다.
  // 이렇게 함으로써 자식 컴포넌트들이 recoil과 react-query의 기능을 사용할 수 있게 됩니다.
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>{children}</RecoilRoot>
      <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Provider;
