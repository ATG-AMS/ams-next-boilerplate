"use client"; // React Client 컴포넌트 임을 명시

import { User } from "@prisma/client"; // Prisma 클라이언트에서 User 타입
import { atom } from "recoil"; // Recoil에서 상태를 정의할 atom을 가져옴

// 테이블 상태를 나타내는 인터페이스를 선언
export interface ISampleTableState {
  rows: User[]; // 테이블의 행 데이터
  count: number; // 전체 행의 수
  pageSize: number; // 한 페이지당 표시될 행의 수
  pageIndex: number; // 현재 페이지 인덱스
  pageCount: number; // 전체 페이지 수
  refetch: () => void; // 데이터를 다시 가져오기 위한 함수
}

// 위에서 정의한 인터페이스를 기반으로 Recoil 상태(atom)를 생성
export const sampleTableState = atom<ISampleTableState>({
  key: "sampleTableState", // Recoil atom의 고유 키
  default: {
    // 초기값
    rows: [],
    count: 0,
    pageSize: 10,
    pageIndex: 0,
    pageCount: 0,
    refetch: () => null,
  },
});
