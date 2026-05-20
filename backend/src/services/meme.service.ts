// Crypto meme fetcher — primary source: meme-api.com (free, no auth)
// Falls back to curated text memes if the API is unreachable or returns unusable content.

import axios from "axios";

export interface MemeItem {
  id: string;
  title: string;
  imageUrl: string | null;
  postUrl: string;
  source: string;
  ups: number;
}

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;

// Curated fallback text jokes — styled as meme cards in the UI
const FALLBACK_MEMES: MemeItem[] = [
  {
    id: "fallback-1",
    title: "When you finally buy the dip and it keeps dipping 📉",
    imageUrl: null,
    postUrl: "https://reddit.com/r/cryptocurrencymemes",
    source: "r/cryptocurrencymemes",
    ups: 9001,
  },
  {
    id: "fallback-2",
    title:
      "My investment strategy: buy high, sell low, and tell everyone I'm a long-term investor 💸",
    imageUrl: null,
    postUrl: "https://reddit.com/r/Bitcoin",
    source: "r/Bitcoin",
    ups: 7777,
  },
  {
    id: "fallback-3",
    title: "Me explaining DeFi to my parents at 2am like they care 🌙",
    imageUrl: null,
    postUrl: "https://reddit.com/r/cryptocurrencymemes",
    source: "r/cryptocurrencymemes",
    ups: 6942,
  },
  {
    id: "fallback-4",
    title:
      "Satoshi Nakamoto watching Bitcoin hit $1 million: 'I should have kept more' 👀",
    imageUrl: null,
    postUrl: "https://reddit.com/r/CryptoCurrency",
    source: "r/CryptoCurrency",
    ups: 8420,
  },
  {
    id: "fallback-5",
    title:
      "Me: I'll sell when it 10x's. It 10x's. Me: I'll sell when it 100x's. 🤡",
    imageUrl: null,
    postUrl: "https://reddit.com/r/cryptocurrencymemes",
    source: "r/cryptocurrencymemes",
    ups: 11234,
  },
];

const SUBREDDITS = ["cryptocurrencymemes", "Bitcoin", "CryptoCurrency"];

export async function getMeme(): Promise<MemeItem> {
  try {
    const sub = SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)];
    const { data } = await axios.get<{ count: number; memes: any[] }>(
      `https://meme-api.com/gimme/${sub}/5`,
      { timeout: 6000 },
    );

    const valid = (data.memes || []).filter(
      (m: any) => !m.nsfw && !m.spoiler && IMAGE_EXT.test(m.url),
    );

    if (valid.length === 0) throw new Error("No valid image memes");

    // Pick the one with most upvotes
    const best = valid.sort((a: any, b: any) => b.ups - a.ups)[0];

    return {
      id: best.postLink,
      title: best.title,
      imageUrl: best.url,
      postUrl: best.postLink,
      source: `r/${best.subreddit}`,
      ups: best.ups,
    };
  } catch {
    // Serve a random curated text meme as fallback
    const idx = Math.floor(Math.random() * FALLBACK_MEMES.length);
    return FALLBACK_MEMES[idx];
  }
}
