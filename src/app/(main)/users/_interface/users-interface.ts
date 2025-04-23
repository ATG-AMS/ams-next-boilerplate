/**
 * 단일 사용자 정보를 나타내는 인터페이스
 */
export interface User {
  /** 고유 인덱스 (Primary Key) */
  idx: number;

  /** 사용자 이름 */
  name: string;

  /** 사용자 이메일 주소 (고유값) */
  email: string;

  /** 사용자 나이 (선택적) */
  age?: number;

  /** 방문 횟수 (선택적) */
  visits?: number;

  /** 진행률 (0~100%, 선택적) */
  progress?: number;

  /** 상태 값 (예: 'single', 'relationship' 등, 선택적) */
  status?: string;

  /** 생성 시각 (선택적) */
  createdAt?: Date;
}

/**
 * 사용자 목록 조회 시 서버로부터 반환받는 응답 형태
 */
export interface UsersResponse {
  /** 사용자 목록 데이터 */
  rows: User[];

  /** 전체 사용자 수 (페이징 계산용) */
  count: number;
}

/**
 * 사용자 목록 조회에 사용되는 쿼리 파라미터
 */
export interface UsersQueryParams {
  /** 페이지 번호 (0-based index) */
  page?: number;

  /** 한 페이지에 보여줄 항목 수 */
  limit?: number;

  /** 정렬 기준 필드명 */
  sort?: string;

  /** 정렬 방향 ('asc': 오름차순, 'desc': 내림차순) */
  order?: 'asc' | 'desc';

  /** 사용자명 검색 필터 */
  name?: string;

  /** 이메일 검색 필터 */
  email?: string;
}
