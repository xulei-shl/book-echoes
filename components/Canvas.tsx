'use client';

import { useEffect } from 'react';
import { Book } from '@/types';
import BookCard from './BookCard';
import InfoPanel from './InfoPanel';
import Dock from './Dock';
import Header from './Header';
import { useStore } from '@/store/useStore';
import { AnimatePresence } from 'framer-motion';

interface CanvasProps {
    books: Book[];
    month: string;
}

export default function Canvas({ books, month }: CanvasProps) {
    const { focusedBookId, setViewMode, setSelectedMonth } = useStore();

    useEffect(() => {
        setViewMode('canvas');
        setSelectedMonth(month);
    }, [month, setViewMode, setSelectedMonth]);

    const [yearStr, monthStr] = month.split('-');
    const yearInt = parseInt(yearStr);
    const monthInt = parseInt(monthStr);

    const yearCN = yearStr.split('').map(d => '零一二三四五六七八九'[parseInt(d)]).join('');
    const monthCN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][monthInt - 1];

    const focusedBook = books.find(b => b.id === focusedBookId);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[#1a1a1a]">
            {/* Background Layer: Subtle Radial Gradient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #2a2a2a 0%, #1a1a1a 60%, #111111 100%)'
                }}
            />

            {/* Background Layer: Typographic Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
                <div className="relative flex flex-col items-center justify-center opacity-[0.05] transform scale-150">
                    <div className="font-display text-[15vw] leading-none text-[#E8E6DC] tracking-[0.2em] whitespace-nowrap">
                        {yearCN}
                    </div>
                    <div className="font-display text-[25vw] leading-none text-[#E8E6DC] font-bold tracking-widest mt-[-2vw]">
                        {monthCN}月
                    </div>
                </div>
            </div>

            <div className="noise-overlay" />

            {/* Header with Logo and Home Button */}
            <Header showHomeButton={true} theme="dark" />

            {/* Books Layer */}
            <div className="absolute inset-0 z-10">
                {books.map((book, index) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        state={focusedBookId ? 'focused' : 'scatter'}
                        index={index}
                    />
                ))}
            </div>

            {/* Info Panel Layer */}
            <AnimatePresence>
                {focusedBook && <InfoPanel key="panel" book={focusedBook} books={books} />}
            </AnimatePresence>

            {/* Dock Layer */}
            <Dock books={books} />
        </div>
    );
}
