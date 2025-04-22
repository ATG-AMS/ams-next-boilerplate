import { z } from "zod";

export const manualAddUserSchema = z.object({
    name: z
      .string()
      .trim()
      .min(2, { message: '2자 이상 입력하세요.' }),
    email: z
      .string()
      .email({ message: '이메일 형식이 아닙니다.' })
      .nonempty(),
    age: z
      .number({ invalid_type_error: '숫자만 입력해주세요.' })
      .min(1, { message: '1이상의 숫자를 입력해주세요' })
      .optional(),
    visits: z.number().optional(),
    progress: z.number().optional(),
    status: z.string().optional(),
  });

export type ManualAddUserFormData = z.infer<typeof manualAddUserSchema>;