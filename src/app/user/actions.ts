// app/user/actions.ts
'use server'

import { prisma } from '@/lib/prisma'

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  // DB 작업 실행
  await prisma.user.create({ data: { name, email } })
}
