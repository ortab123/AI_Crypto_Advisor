-- CreateTable
CREATE TABLE "news_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voteType" TEXT NOT NULL,
    "cryptoAssets" TEXT[],
    "articleUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "author" TEXT,
    "articleColors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coin_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coinSymbol" TEXT NOT NULL,
    "voteType" TEXT NOT NULL,
    "priceTrend" TEXT NOT NULL,
    "volatilityLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coin_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insightId" TEXT NOT NULL,
    "voteType" TEXT NOT NULL,
    "cryptoAssets" TEXT[],
    "riskLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insight_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meme_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "memeId" TEXT NOT NULL,
    "reactionType" TEXT NOT NULL,
    "cryptoAssets" TEXT[],
    "memeStyle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meme_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reddit_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "voteType" TEXT NOT NULL,
    "cryptoAssets" TEXT[],
    "postTopic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reddit_votes_pkey" PRIMARY KEY ("id")
);
