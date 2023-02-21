import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

// res, reqを引数にもつ関数を定義する
export default async function (req: NextApiRequest, res: NextApiResponse) {
  // 認証情報の取得
  const session = await getSession({ req })

  // session オブジェクトに email が存在しているかを判定
  // users テーブルの email カラムは必須
  if (session?.user?.email && req.body.title && req.body.content) {
    const result = await prisma.article.create({
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    })
    res.json(result)
  } else {
    res.status(401).send({ message: 'Unauthorized or FormEmpty' })
  }
}
