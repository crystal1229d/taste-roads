import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import prisma from '@/db'
import { LikeInterface, LikeApiResponse } from '@/interface'
interface ResponseType {
  page?: string
  limit?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LikeInterface | LikeApiResponse>,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user) {
    return res.status(401)
  }

  if (req.method === 'POST') {
    const { storeId }: { storeId: number } = req.body

    let like = await prisma.like.findFirst({
      where: {
        storeId,
        userId: session?.user?.id,
      },
    })

    if (like) {
      // 이미 찜을 한 상황 : like 데이터 삭제
      like = await prisma.like.delete({
        where: {
          id: like.id,
        },
      })
      return res.status(204).json(like)
    } else {
      // 찜을 하지 않은 상황 : like 데이터 생성
      like = await prisma.like.create({
        data: {
          storeId,
          userId: session?.user?.id,
        },
      })

      return res.status(201).json(like)
    }
  } else if (req.method === 'GET') {
    const count = await prisma.like.count({
      where: {
        userId: session.user.id,
      },
    })

    const { page = '1', limit = '10' }: ResponseType = req.query
    const skipPage = parseInt(page) - 1

    const likes = await prisma.like.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        userId: session.user.id,
      },
      include: {
        store: true,
      },
      skip: skipPage * parseInt(limit),
      take: parseInt(limit),
    })

    return res.status(200).json({
      data: likes,
      page: parseInt(page),
      totalPage: Math.ceil(count / parseInt(limit)),
    })
  }
}
