'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  User,
  UsersResponse,
  UsersQueryParams as QueryParams,
} from '../_interface/users-interface';

// #1. 공통 fetch 헬퍼

/**
 * 지정된 URL로 fetch 요청을 보내고, 응답을 제네릭 타입으로 반환함.
 *
 * @template T - 반환 타입
 * @param url - 요청할 URL
 * @param options - fetch 옵션 객체
 * @returns 응답 본문을 JSON으로 파싱한 결과
 * @throws 요청 실패 시, 에러 객체
 */
const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`HTTP ${res.status} - ${res.statusText}: ${errorBody}`);
  }

  return res.json();
};

// #2. 유저 리스트 조회 함수

/**
 * 유저 목록을 서버로부터 조회함.
 *
 * @param params - 페이지네이션, 정렬, 필터 등 쿼리 조건
 * @returns 유저 목록과 메타 정보(전체 개수 등)
 */
const fetchUsers = async (params: QueryParams): Promise<UsersResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', String(params.page));
  if (params.limit) queryParams.append('limit', String(params.limit));
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.order) queryParams.append('order', params.order);
  if (params.name) queryParams.append('name', params.name);
  if (params.email) queryParams.append('email', params.email);

  const url = `/api/users?${queryParams.toString()}`;
  return fetcher<UsersResponse>(url);
};

// #3. 유저 목록 조회를 위한 React Query Hook

/**
 * 유저 목록을 가져오는 React Query Hook.
 *
 * @param params - 조회에 사용할 쿼리 파라미터
 * @returns Query 상태 및 데이터
 */
export const useUsersQuery = (params: QueryParams) =>
  useQuery<UsersResponse>({
    queryKey: ['users', JSON.stringify(params)], // queryKey 안정화를 위해 JSON 문자열화
    queryFn: () => fetchUsers(params),
  });

// #4. 공통 Mutation Hook Factory

/**
 * 사용자 API에 대한 공통 Mutation Hook을 생성함.
 *
 * @template TInput - 요청 본문 타입
 * @template TOutput - 응답 타입
 * @param method - HTTP 메서드 (POST, PUT, DELETE)
 * @param bodyBuilder - 요청 본문 생성 함수
 * @returns useMutation으로 생성된 커스텀 Hook
 */
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
      // 성공 시 유저 목록 데이터를 무효화 → 자동 재요청 발생
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// #5. 사용자 API 전용 커스텀 Hook
/**
 * 사용자 추가 요청을 처리하는 Mutation Hook
 */
export const useCreateUser = () =>
  useUserMutation<Partial<User>, User>('POST', (newUser) => newUser);

/**
 * 사용자 정보 수정 요청을 처리하는 Mutation Hook
 */
export const useUpdateUser = () =>
  useUserMutation<Partial<User> & { idx: number }, User>('PUT', (user) => user);

/**
 * 사용자 삭제 요청을 처리하는 Mutation Hook
 */
export const useDeleteUser = () =>
  useUserMutation<number | string, { success: boolean }>('DELETE', (idx) => ({
    idx,
  }));
