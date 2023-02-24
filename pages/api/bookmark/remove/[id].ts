import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { getSession } from 'next-auth/react'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (session?.user?.email) {
    const result = await prisma.bookmarkOnUsers.deleteMany({
      where: {
        AND: [
          {
            bookmarkUserId: session.user?.id as number,
            ArticleId: Number(req.query.id),
          },
        ],
      },
    })
    res.json(result)
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}
