import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'

const Article = () => {
  return <div>article</div>
}

export default Article

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  res,
}) => {
  const session = await getSession({ req })
  if (!session) {
    res.statusCode = 401
    return { props: { article: null } }
  }
  const article = await prisma.article.findUnique({
    where: {
      id: Number(params?.id),
    },
  })
  return {
    props: { article },
  }
}
