// src/app/user/_libs/userSchema.ts

/*
 * zod 사용 이유:
 * 타입스크립트 프로젝트에서 런타임에서 데이터 유효성 검증 및 타입 안전성을 강화하기 위해 사용
 *
*/
import * as z from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(20, '이름은 20자 이하여야 합니다.'),
  email: z.string().email('유효한 이메일 형식이어야 합니다.'),
  age: z
    .number({ invalid_type_error: '숫자여야 합니다.' })
    .int('정수만 입력 가능합니다.')
    .positive('양수만 입력 가능합니다.')
    .lte(150, '150세 이하로 입력해주세요.')
    .optional(),
});
