'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArchiveYearNav from './ArchiveYearNav';
import MagazineCard from './MagazineCard';

import { MonthData } from '@/lib/content';

interface ArchiveContentProps {
    years: string[];
    monthsByYear: Record<string, MonthData[]>;
}

// 辅助函数：将月份转换为繁体汉字
function getMonthCharacter(monthId: string): string {
    const parts = monthId.split('-');
    if (parts.length !== 2) return '月';

    const monthNum = parseInt(parts[1]);
    const monthChars = ['', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾', '冬', '腊'];

    if (monthNum >= 1 && monthNum <= 12) {
        return monthChars[monthNum];
    }

    return '月';
}

export default function ArchiveContent({ years, monthsByYear }: ArchiveContentProps) {
    const [activeYear, setActiveYear] = useState(years[0]);

    return (
        <div className="relative z-10 pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                {/* Left Sidebar - Year Navigation */}
                <aside className="md:col-span-2 hidden md:block sticky top-32 h-fit">
                    <ArchiveYearNav
                        years={years}
                        activeYear={activeYear}
                        onYearSelect={setActiveYear}
                    />
                </aside>

                {/* Right Content - Cover Grid */}
                <main className="md:col-span-10 min-h-[60vh]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeYear}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <div className="mb-8 border-b border-[#C9A063]/20 pb-4 flex items-end gap-4">
                                <h2 className="font-display text-3xl md:text-4xl text-[#C9A063]">
                                    {activeYear}
                                </h2>
                                <span className="text-sm font-mono text-[#C9A063]/40 mb-1 tracking-widest">ARCHIVE COLLECTION</span>
                            </div>

                            {(!monthsByYear[activeYear] || monthsByYear[activeYear].length === 0) ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-[#C9A063]/40 font-display text-xl tracking-widest border border-[#C9A063]/10 bg-[#1a1a1a]/30">
                                    COMING SOON
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                                    {monthsByYear[activeYear].map((month, index) => {
                                        const monthChar = getMonthCharacter(month.id);

                                        return (
                                            <div
                                                key={month.id}
                                                className="relative group p-6 border border-[#C9A063]/20 bg-[#1a1a1a]/50 hover:border-[#C9A063]/60 hover:bg-[#C9A063]/5 transition-all duration-500 overflow-hidden"
                                            >
                                                {/* 大型繁体汉字背景 - 右下角位置 */}
                                                <div className="absolute -bottom-14 -right-10 pointer-events-none select-none">
                                                    <span
                                                        className="font-display text-[16rem] md:text-[18rem] leading-none text-[#C9A063] transition-all duration-700 ease-out block"
                                                        style={{
                                                            opacity: 0.12,
                                                            transform: 'rotate(-5deg)',
                                                        }}
                                                    >
                                                        {monthChar}
                                                    </span>
                                                </div>

                                                {/* 悬停时的汉字动画效果 */}
                                                <div className="absolute -bottom-14 -right-10 pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                                    <span
                                                        className="font-display text-[16rem] md:text-[18rem] leading-none text-[#C9A063] transition-all duration-700 ease-out block"
                                                        style={{
                                                            opacity: 0.18,
                                                            transform: 'rotate(-5deg) scale(1.05)',
                                                        }}
                                                    >
                                                        {monthChar}
                                                    </span>
                                                </div>

                                                {/* Corner Accents */}
                                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C9A063]/40 group-hover:border-[#C9A063] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 z-10" />
                                                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C9A063]/40 group-hover:border-[#C9A063] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 z-10" />
                                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#C9A063]/40 group-hover:border-[#C9A063] group-hover:-translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-500 z-10" />
                                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C9A063]/40 group-hover:border-[#C9A063] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-500 z-10" />

                                                {/* Technical Label */}
                                                <div className="absolute top-2 left-3 text-[10px] font-mono text-[#C9A063]/60 tracking-widest opacity-70 group-hover:opacity-100 transition-opacity z-10">
                                                    {month.id.replace('-', '.')}
                                                </div>

                                                {/* Card Content */}
                                                <MagazineCard month={month} className="h-[360px] relative z-10" />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
