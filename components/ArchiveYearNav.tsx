'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ArchiveYearNavProps {
    years: string[];
    activeYear: string;
    onYearSelect: (year: string) => void;
}

export default function ArchiveYearNav({ years, activeYear, onYearSelect }: ArchiveYearNavProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef(false);

    // 处理滚轮事件
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            if (isScrolling.current) return;

            const currentIndex = years.indexOf(activeYear);
            if (currentIndex === -1) return;

            if (e.deltaY > 0) {
                // 向下滚动，选择下一年（如果存在）
                if (currentIndex < years.length - 1) {
                    onYearSelect(years[currentIndex + 1]);
                    isScrolling.current = true;
                    setTimeout(() => isScrolling.current = false, 300); // 防抖
                }
            } else {
                // 向上滚动，选择上一年（如果存在）
                if (currentIndex > 0) {
                    onYearSelect(years[currentIndex - 1]);
                    isScrolling.current = true;
                    setTimeout(() => isScrolling.current = false, 300);
                }
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [years, activeYear, onYearSelect]);

    return (
        <div
            ref={containerRef}
            className="relative h-[60vh] flex flex-col justify-center items-end pr-8 pointer-events-auto select-none"
        >
            {/* 右侧渐变分割线 */}
            <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-[#C9A063]/60 to-transparent" />

            {/* 年份列表 */}
            <div className="flex flex-col gap-1 w-full items-end relative perspective-[1000px]">
                {years.map((year, index) => {
                    const isActive = year === activeYear;
                    const currentIndex = years.indexOf(activeYear);
                    const distance = Math.abs(index - currentIndex);

                    // 计算视觉属性
                    // 距离越远，透明度越低，缩放越小
                    const opacity = isActive ? 1 : Math.max(0.2, 0.8 - distance * 0.3);
                    const scale = isActive ? 1.2 : Math.max(0.6, 1 - distance * 0.15);
                    const x = isActive ? -20 : 0; // 激活时向左突出

                    return (
                        <motion.button
                            key={year}
                            onClick={() => onYearSelect(year)}
                            className="group relative flex items-center justify-end py-3 focus:outline-none w-full"
                            initial={false}
                            animate={{
                                opacity,
                                scale,
                                x,
                                filter: isActive ? 'blur(0px)' : `blur(${distance * 1}px)`, // 简单的景深效果
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                        >
                            {/* 年份文本 */}
                            <span
                                className={`
                                    font-display tracking-widest transition-colors duration-300
                                    ${isActive
                                        ? 'text-4xl md:text-5xl text-[#C9A063] font-bold shadow-amber-500/20 drop-shadow-lg'
                                        : 'text-2xl md:text-3xl text-gray-500 group-hover:text-[#C9A063]/70'
                                    }
                                `}
                            >
                                {year}
                            </span>

                            {/* 激活状态指示点 */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeYearDot"
                                    className="absolute -right-[38px] w-2 h-2 rounded-full bg-[#C9A063] shadow-[0_0_10px_rgba(201,160,99,0.8)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
