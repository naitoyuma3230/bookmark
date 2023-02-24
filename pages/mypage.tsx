import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import Router from 'next/router'
import { type } from 'os'
import prisma from '../lib/prisma'
import { ArticleProps } from '../types/Article'
import { articles } from '../data/articles'

type Props = {
  articles: ArticleProps[]
  postArticles: ArticleProps[]
}

async function removeBookmark(id: number): Promise<void> {
  await fetch(
    process.env.NEXT_PUBLIC_VERCEL_URL + `/api/bookmark/remove/${id}`,
    {
      method: 'PUT',
    }
  )
  Router.push('/mypage')
}

async function removeArticle(id: number): Promise<void> {
  await fetch(
    process.env.NEXT_PUBLIC_VERCEL_URL + `/api/article/remove/${id}`,
    {
      method: 'DELETE',
    }
  )
  Router.push('/mypage')
}

// getServerSideProps：サーバーサイドで実行される
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })
  if (!session) {
    res.statusCode = 401
    return { props: { articles: null } }
  }
  const loginUser = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string,
    },
  })

  const bookmarkedArticlesbyUser = await prisma.bookmarkOnUsers.findMany({
    where: {
      bookmarkUserId: loginUser?.id,
    },
    include: {
      Articles: true,
      bookmark: true,
    },
  })

  const postedByLoginUserArticles = await prisma.article.findMany({
    where: {
      authorId: loginUser?.id,
    },
  })

  const data = bookmarkedArticlesbyUser.map((bookmarkedArticle) => {
    const users = []
    users.push(bookmarkedArticle.bookmark)

    const ret = {
      ...bookmarkedArticle.Articles,
      users: users,
    }
    return ret
  })

  const articles = JSON.parse(JSON.stringify(data))
  const postArticles = JSON.parse(JSON.stringify(postedByLoginUserArticles))
  return {
    props: { articles, postArticles },
  }
}

const Mypage = (props: Props) => {
  return (
    <div className='container mx-auto px-6 py-16 '>
      {props.articles.length > 0 ? (
        // ブックマークしている記事が存在する場合、記事の一覧を表示します
        <div className='mx-auto sm:w-8/12 lg:w-6/12 xl:w-[40%]'>
          <div className='overflow-x-auto'>
            <h1 className='mb-8 text-center text-3xl'>
              All Articles you bookmarked
            </h1>
            <table className='w-full table-auto'>
              <tbody className='divide-y divide-slate-100 text-sm font-medium'>
                {props.articles.map((article) => (
                  <tr
                    key={article.id}
                    className='group transition-colors hover:bg-gray-100'
                  >
                    <td className='py-4 pl-10'>
                      <div>
                        <p
                          onClick={() => Router.push(`/articles/${article.id}`)}
                          className='cursor-pointer text-lg font-semibold text-gray-700'
                        >
                          {article.title}
                        </p>
                        <div className='font-medium text-gray-400'>
                          {article.users.length > 1
                            ? //  ここでは user という単語の単数形と複数形の切り替えを行なっています
                              `${article.users.length} users`
                            : `${article.users.length} user`}{' '}
                          Bookmarked this article
                        </div>
                      </div>
                    </td>
                    <td className='ml-auto px-2 text-center font-medium'>
                      <span
                        className='cursor-pointer rounded bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800 dark:bg-red-200 dark:text-red-900'
                        onClick={() => removeBookmark(article.id)}
                      >
                        DELETE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // ブックマークしている記事が存在しない場合、記事の一覧ページへのリンクを表示します
        <div className='text-center'>
          <h1 className='text-3xl'>No Articles you post</h1>
          <Link href='/articles'>
            <div className='group mt-5 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 font-medium text-gray-900 hover:text-white focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'>
              <span className='rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Find Articles
              </span>
            </div>
          </Link>
        </div>
      )}
      {props.postArticles.length > 0 ? (
        // LoginUserが投稿した記事が存在する場合、記事の一覧を表示
        <div className='mx-auto sm:w-8/12 lg:w-6/12 xl:w-[40%] mt-20'>
          <div className='overflow-x-auto'>
            <h1 className='mb-8 text-center text-3xl'>All articles you post</h1>
            <table className='w-full table-auto'>
              <tbody className='divide-y divide-slate-100 text-sm font-medium'>
                {props.postArticles.map((article) => (
                  <tr
                    key={article.id}
                    className='group transition-colors hover:bg-gray-100'
                  >
                    <td className='py-4 pl-10'>
                      <div>
                        <p
                          onClick={() => Router.push(`/articles/${article.id}`)}
                          className='cursor-pointer text-lg font-semibold text-gray-700'
                        >
                          {article.title}
                        </p>
                      </div>
                      <div className='font-medium text-gray-400'>
                        {article.content}
                      </div>
                    </td>
                    <td className='ml-auto px-2 text-center font-medium'>
                      <span
                        className='cursor-pointer rounded bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800 dark:bg-red-200 dark:text-red-900'
                        onClick={() => removeArticle(article.id)}
                      >
                        DELETE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // ブックマークしている記事が存在しない場合、記事の一覧ページへのリンクを表示します
        <div className='text-center mt-20'>
          <h1 className='text-3xl'>No articles bookmarked</h1>
          <Link href='/post'>
            <div className='group mt-5 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 font-medium text-gray-900 hover:text-white focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'>
              <span className='rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Post Articles
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Mypage
