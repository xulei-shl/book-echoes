'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RandomMasonryProps {
    initialBooks: Book[];
}

export default function RandomMasonry({ initialBooks }: RandomMasonryProps) {
    const [books, setBooks] = useState(initialBooks);
    const router = useRouter();
    const baseCardHeight = 360;
    const heightVariants = [1.05, 1.3, 1.55, 1.2];

    // Shuffle on mount to ensure randomness on client side as well
    useEffect(() => {
        setBooks([...initialBooks].sort(() => Math.random() - 0.5));
    }, [initialBooks]);

    const shuffle = () => {
        setBooks(prev => [...prev].sort(() => Math.random() - 0.5));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getLabel = (sourceId: string) => {
        if (sourceId.includes('-sleeping-')) {
            const name = sourceId.split('-sleeping-')[1];
            return `睡美人 · ${decodeURIComponent(name)}`;
        }
        if (sourceId.includes('-subject-')) {
            const name = sourceId.split('-subject-')[1];
            return `主题 · ${decodeURIComponent(name)}`;
        }
        return sourceId; // Month case: YYYY-MM
    };

    const getCardHeight = (index: number) => baseCardHeight * heightVariants[index % heightVariants.length];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0b0b0b] text-[#F2F0E9]">
            {/* 背景层：延续往期回顾页面的网格秩序与微光 */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* 基础暗色渐变，保证和谐基底 */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(135deg, #050505 0%, #101010 45%, #1a1410 100%)'
                    }}
                />
                {/* 细致网格 */}
                <div
                    className="absolute inset-0 opacity-80 mix-blend-screen"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(201, 160, 99, 0.06) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(201, 160, 99, 0.06) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />
                {/* 主网格 */}
                <div
                    className="absolute inset-0 opacity-70 mix-blend-screen"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(201, 160, 99, 0.12) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(201, 160, 99, 0.12) 1px, transparent 1px)
                        `,
                        backgroundSize: '300px 300px'
                    }}
                />
                {/* 纵向扫描线条 */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#d4a57433] to-transparent opacity-60" />
                <div className="absolute inset-y-0 left-1/4 w-px bg-gradient-to-b from-transparent via-[#d4a57422] to-transparent opacity-50" />
                <div className="absolute inset-y-0 right-1/6 w-px bg-gradient-to-b from-transparent via-[#d4a57422] to-transparent opacity-50" />
                {/* 柔和光晕 */}
                <div
                    className="absolute inset-0 opacity-70"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 25%, rgba(212, 165, 116, 0.2), transparent 55%),
                            radial-gradient(circle at 75% 15%, rgba(255, 255, 255, 0.08), transparent 45%),
                            radial-gradient(circle at 65% 80%, rgba(214, 131, 97, 0.18), transparent 55%)
                        `,
                        filter: 'blur(45px)'
                    }}
                />
            </div>

            {/* Header Navigation */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-6 pointer-events-none">
                <div className="flex items-center gap-3 pointer-events-auto">
                    <Link href="/" className="btn-random px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-body tracking-widest">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>首页</span>
                    </Link>
                    <Link href="/archive" className="btn-random px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-body tracking-widest">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>往期</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 py-32 mx-auto max-w-6xl">
                {/* Masonry Layout */}
                <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
                    {books.map((book, index) => {
                        const cardHeight = getCardHeight(index);
                        return (
                        <motion.div
                            key={`${book.id}-${index}`}
                            layout
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: Math.min(index * 0.03, 1.5), ease: [0.22, 1, 0.36, 1] }}
                            className="break-inside-avoid mb-6 group relative cursor-pointer"
                            onClick={() => router.push(`/${book.month}`)}
                        >
                            <div className="relative overflow-hidden rounded-sm shadow-[0_15px_45px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-500 bg-[#1c1915] border border-[#d4a5741a]">
                                {/* Image */}
                                <img
                                    src={book.originalImageUrl || book.originalThumbnailUrl || book.cardImageUrl || book.coverUrl}
                                    alt={book.title}
                                    className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-100"
                                    loading="lazy"
                                    style={{ maxHeight: cardHeight }}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 backdrop-blur-[1px]">
                                    <h3 className="text-[#F2F0E9] font-bold text-lg font-display tracking-wide drop-shadow-md line-clamp-2 leading-relaxed">{book.title}</h3>
                                    <p className="text-[#D4A574] text-xs mt-2 font-accent tracking-wider">{getLabel(book.month)}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                    })}
                </div>
            </div>

            {/* Shuffle Button */}
            <button
                onClick={shuffle}
                className="btn-random btn-random--dark btn-random--circle btn-random--circle-lg fixed bottom-12 right-12 shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_35px_rgba(212,165,116,0.25)] hover:scale-110 z-50 group border border-white/10"
                aria-label="Shuffle"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-700 ease-in-out">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <circle cx="8" cy="8" r="2"></circle>
                    <circle cx="16" cy="16" r="2"></circle>
                    <circle cx="8" cy="16" r="2"></circle>
                    <circle cx="16" cy="8" r="2"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                </svg>
            </button>
        </div>
    );
}
