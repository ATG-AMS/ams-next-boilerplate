"use client";

import React, { ReactNode } from "react";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  fetchC,
  parseRequestParams,
  ClientSideFetchOptions,
  RequestParams,
} from "@/lib/utils";

type Props = {
  children: ReactNode;
};

export default function Provider({ children }: Props) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async (context) => {
          const options: ClientSideFetchOptions = {
            endpoint: "",
            // token: token,
            ...(parseRequestParams(
              context.queryKey as Partial<RequestParams>[],
            ) as RequestParams),
          };
          return fetchC(options);
        },
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>{children}</RecoilRoot>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}
