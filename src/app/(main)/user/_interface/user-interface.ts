export interface User {
  idx: number;
  name: string;
  email: string;
  age: number;
  visits: number;
  progress: number;
  status: string
  createdAt: Date | null;
}