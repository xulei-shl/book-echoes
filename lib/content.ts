import { promises as fs } from 'fs';
import path from 'path';
import { legacyCardThumbnailPath, resolveImageUrl } from '@/lib/assets';

export interface Book {
  '书目条码': string | number;
  '豆瓣书名': string;
  '豆瓣副标题'?: string;
  '豆瓣作者'?: string;
  '豆瓣出版社'?: string;
  '豆瓣出版年'?: number | string;
  cardImageUrl?: string;
  cardThumbnailUrl?: string;
  coverImageUrl?: string;
  coverThumbnailUrl?: string;
  originalImageUrl?: string;
  originalThumbnailUrl?: string;
  [key: string]: any;
}

export interface MonthData {
  id: string;
  label: string;
  vol: string;
  previewCards: string[];
  bookCount: number;
  books: Book[];
}

export async function getMonths(): Promise<MonthData[]> {
  const contentDir = path.join(process.cwd(), 'public', 'content');
  try {
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    const months = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .map(entry => entry.name)
      .sort((a, b) => b.localeCompare(a)); // Newest first

    const monthsWithData = await Promise.all(months.map(async (id, index) => {
      // Format: 2025-09 -> 二零二五年 九月
      const [year, month] = id.split('-');
      const yearCN = year.split('').map(d => '零一二三四五六七八九'[parseInt(d)]).join('');
      const monthCN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][parseInt(month) - 1];

      let previewCards: string[] = [];
      let bookCount = 0;
      let books: Book[] = [];

      try {
        const metadataPath = path.join(contentDir, id, 'metadata.json');
        const metadataContent = await fs.readFile(metadataPath, 'utf8');
        books = JSON.parse(metadataContent);
        bookCount = books.length;

        // Randomly select 4-6 books for collage preview to create variety
        const numToShow = Math.min(books.length, Math.floor(Math.random() * 3) + 4); // 4-6 books
        const shuffled = [...books].sort(() => Math.random() - 0.5);
        const booksToShow = shuffled.slice(0, numToShow);

        previewCards = booksToShow.map((book: Book) => {
          const bookId = String(book['书目条码']);
          const candidate = book.cardThumbnailUrl || book.cardImageUrl;
          return resolveImageUrl(candidate, legacyCardThumbnailPath(id, bookId));
        });
      } catch (e) {
        console.warn(`Could not load metadata for ${id}:`, e);
      }

      return {
        id,
        label: `${yearCN}年 ${monthCN}月`,
        vol: `Vol. ${months.length - index}`,
        previewCards,
        bookCount,
        books
      };
    }));

    return monthsWithData;
  } catch (e) {
    console.error("Error reading content directory:", e);
    return [];
  }
}

export async function getAboutContent() {
  const aboutPath = path.join(process.cwd(), 'public', 'About.md');
  try {
    return await fs.readFile(aboutPath, 'utf8');
  } catch (e) {
    console.warn('Failed to load About content:', e);
    return '';
  }
}
