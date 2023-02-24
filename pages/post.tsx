import Router from 'next/router'
import { ReactElement, useState } from 'react'
import { ArticleForm } from '../types/ArticleForm'

const Post = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  async function addArticle(): Promise<void> {
    await fetch(process.env.NEXT_PUBLIC_VERCEL_URL + `/api/article/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    })
    Router.push(`/articles`)
  }

  return (
    <div className='m-20'>
      <form>
        <div className='mb-6'>
          <label className='block mb-2 text-lg font-medium text-gray-900 '>
            TITLE
          </label>
          <input
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='title'
            required
            value={title}
            onChange={(e) => handleChangeTitle(e)}
          />
        </div>
        <div className='mb-6'>
          <label className='block mb-2 text-lg font-medium text-gray-900'>
            CONTENT
          </label>
          <textarea
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500'
            required
            value={content}
            onChange={(e) => handleChangeContent(e)}
          />
        </div>
        <div className='flex items-start'></div>
        <button
          type='button'
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          onClick={(e) => {
            e.preventDefault()
            addArticle()
          }}
        >
          POST
        </button>
      </form>
    </div>
  )
}

export default Post
