"use client";

import { User } from "@prisma/client";
import { atom } from "recoil";

export interface ISampleTableState {
  rows: User[];
  count: number;
  pageSize: number;
  pageIndex: number;
  pageCount: number;
  refetch: () => void;
}

export const sampleTableState = atom<ISampleTableState>({
  key: "sampleTableState",
  default: {
    rows: [],
    count: 0,
    pageSize: 10,
    pageIndex: 0,
    pageCount: 0,
    refetch: () => null,
  },
});
