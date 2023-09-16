import localFont from "next/font/local";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const SUIT = localFont({
  src: "../../public/fonts/SUIT/SUIT-Variable.woff2",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ServerSideFetchOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  queryParams?: Record<string, string | number>;
  header?: Record<string, string>;
  body?: any;
}

export const fetchS = async (options: ServerSideFetchOptions) => {
  console.log("🚀 ~ fetchS ~ ServerSide ~ options:", options);
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URI}/${options.endpoint}`);
  if (options.queryParams) {
    createQueryParams(url, options.queryParams);
  }

  const headers: Record<string, string> = options.header || {};
  // const headers: Record<string, string> =
  //   options.header || createHeaders(token);

  if (options.method === "POST" || options.method === "PUT") {
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  }

  const response = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `API Error: ${response.statusText} - ${errorData.message || ""}`,
    );
  }

  return await response.json();
};

export function formatDate(input: string | number | Date): string {
  let date: Date;
  if (!(input instanceof Date)) {
    date = new Date(input);
  } else {
    date = input;
  }
  return date.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export interface ClientSideFetchOptions {
  endpoint: string;
  // token: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  queryParams?: Record<string, string | number>;
  header?: Record<string, string>;
  body?: any;
}

export const fetchC = async (options: ClientSideFetchOptions) => {
  console.log("🚀 ~ fetchC ~ ClientSide ~ options:", options);
  // if (!token) {
  //   throw new Error("Token is not provided");
  // }
  // URL 객체를 생성한다.
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URI}/${options.endpoint}`);
  // 쿼리 파라미터가 있으면 추가한다.
  if (options.queryParams) {
    createQueryParams(url, options.queryParams);
  }

  // 사용자 정의 헤더가 있으면 사용하고, 없으면 기본 헤더를 사용한다.
  const headers: Record<string, string> = options.header || {};
  // const headers: Record<string, string> =
  //   options.header || createHeaders(token);

  // POST, PUT 메소드일 경우 Content-Type을 지정한다.
  if (options.method === "POST" || options.method === "PUT") {
    // Content-Type이 없으면 기본값을 사용한다.
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  }

  const response = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `API Error: ${response.statusText} - ${errorData.message || ""}`,
    );
  }

  return await response.json();
};

const createQueryParams = (
  urlObj: URL,
  queryParams: Record<string, string | number>,
) => {
  Object.keys(queryParams).forEach((key) =>
    urlObj.searchParams.append(key, String(queryParams![key])),
  );
};

const createHeaders = (token: string) => ({
  "X-Authorization": `Bearer ${token}`,
  "X-Requested-With": "XMLHttpRequest",
});

export type RequestParams = {
  endpoint?: string;
  queryParams?: Record<string, string | number>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

// Partial<RequestParams> : RequestParams의 모든 속성을 선택적으로 만듬
export function parseRequestParams(
  arr: Array<Partial<RequestParams>>,
): RequestParams {
  const result: RequestParams = {};

  arr.forEach((item) => {
    if (item.endpoint) {
      result.endpoint = item.endpoint;
    }

    if (item.queryParams) {
      result.queryParams = item.queryParams;
    }

    if (item.method) {
      result.method = item.method;
    }

    if (item.body) {
      result.body = item.body;
    }

    if (item.headers) {
      result.headers = item.headers;
    }
  });

  return result;
}
