'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type User = {
  idx: number;
  name: string;
  email: string;
  age: number;
  visits: number;
  progress: number;
  status: string;
  createdAt: Date;
};

interface UsersResponse {
  rows: User[];
  count: number;
}

interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filter?: string;
}

// #1. 공통 fetch 헬퍼
const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`HTTP ${res.status} - ${res.statusText}: ${errorBody}`);
  }
  return res.json();
};

// #2. 유저 리스트 조회 함수
const fetchUsers = async (params: QueryParams): Promise<UsersResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', String(params.page));
  if (params.limit) queryParams.append('limit', String(params.limit));
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.order) queryParams.append('order', params.order);
  if (params.filter) queryParams.append('filter', params.filter);

  const url = `/api/users?${queryParams.toString()}`;
  return fetcher<UsersResponse>(url);
};

// #3. useQuery Hook
export const useUsersQuery = (params: QueryParams) =>
  useQuery<UsersResponse>({
    queryKey: ['users', JSON.stringify(params)], // 문자열화하여 key 안정화
    queryFn: () => fetchUsers(params),
  });

// #4. 공통 Mutation Factory
const useUserMutation = <TInput, TOutput>(
  method: 'POST' | 'PUT' | 'DELETE',
  bodyBuilder: (input: TInput) => any
) => {
  const queryClient = useQueryClient();
  return useMutation<TOutput, Error, TInput>({
    mutationFn: async (input: TInput) => {
      return fetcher<TOutput>('/api/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyBuilder(input)),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// #5. 생성, 수정, 삭제 Hook
export const useCreateUser = () =>
  useUserMutation<Partial<User>, User>('POST', (newUser) => newUser);

export const useUpdateUser = () =>
  useUserMutation<Partial<User> & { idx: number }, User>('PUT', (user) => user);

export const useDeleteUser = () =>
  useUserMutation<number | string, { success: boolean }>('DELETE', (idx) => ({ idx }));
