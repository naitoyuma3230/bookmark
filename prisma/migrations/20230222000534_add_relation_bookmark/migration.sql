/*
  Warnings:

  - You are about to drop the `_ArticleToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArticleToUser" DROP CONSTRAINT "_ArticleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToUser" DROP CONSTRAINT "_ArticleToUser_B_fkey";

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "authorId" INTEGER;

-- DropTable
DROP TABLE "_ArticleToUser";

-- CreateTable
CREATE TABLE "BookmarkOnUsers" (
    "bookmarkUserId" INTEGER NOT NULL,
    "ArticleId" INTEGER NOT NULL,

    CONSTRAINT "BookmarkOnUsers_pkey" PRIMARY KEY ("bookmarkUserId","ArticleId")
);

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkOnUsers" ADD CONSTRAINT "BookmarkOnUsers_bookmarkUserId_fkey" FOREIGN KEY ("bookmarkUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkOnUsers" ADD CONSTRAINT "BookmarkOnUsers_ArticleId_fkey" FOREIGN KEY ("ArticleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
