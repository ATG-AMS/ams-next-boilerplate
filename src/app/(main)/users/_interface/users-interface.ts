export interface User {
  idx: number;
  name: string;
  email: string;
  age?: number;
  visits?: number;
  progress?: number;
  status?: string;
  createdAt?: Date;
}

export interface UsersResponse {
  rows: User[];
  count: number;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  name?: string;
  email?: string;
}
