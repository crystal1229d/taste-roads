// 문제 : 매번 새로운 PrismaClient 인스턴스를 생성하여 성능 문제(hot reloading) 발생
// 원인 : Next.js 에서 Prisma 사용 시 dev mode 에서는 실행 시 Node.js cache 를 삭제
// 해결 : 해당 파일
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
