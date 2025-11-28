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

    return (
        <div className="min-h-screen bg-[var(--background)]">
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
            <div className="w-full px-6 md:px-12 lg:px-24 py-32 mx-auto">
                {/* Masonry Layout */}
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
                    {books.map((book, index) => (
                        <motion.div
                            key={`${book.id}-${index}`}
                            layout
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: Math.min(index * 0.03, 1.5), ease: [0.22, 1, 0.36, 1] }}
                            className="break-inside-avoid mb-6 group relative cursor-pointer"
                            onClick={() => router.push(`/${book.month}`)}
                        >
                            <div className="relative overflow-hidden rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 bg-[#E8E6DC]">
                                {/* Image */}
                                <img
                                    src={book.originalImageUrl || book.originalThumbnailUrl || book.cardImageUrl || book.coverUrl}
                                    alt={book.title}
                                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                    <h3 className="text-[#F2F0E9] font-bold text-lg font-display tracking-wide drop-shadow-md line-clamp-2 leading-relaxed">{book.title}</h3>
                                    <p className="text-[#D4A574] text-xs mt-2 font-accent tracking-wider">{getLabel(book.month)}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Shuffle Button */}
            <button
                onClick={shuffle}
                className="btn-random btn-random--dark btn-random--circle btn-random--circle-lg fixed bottom-12 right-12 shadow-lg hover:scale-110 z-50 group border border-white/10"
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
