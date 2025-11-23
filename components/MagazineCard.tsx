'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MonthData } from '@/lib/content';

interface MagazineCardProps {
    month: MonthData;
    isLatest?: boolean;
    className?: string;
}

export default function MagazineCard({ month, isLatest = false, className = '' }: MagazineCardProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const previewCards = month.previewCards;

    return (
        <motion.div
            className={`relative w-full cursor-pointer h-[clamp(380px,60vw,540px)] ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push(`/${month.id}`)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative h-full rounded-[30px] overflow-hidden shadow-[0_35px_95px_-40px_rgba(40,22,12,0.65)]"
                style={{ backgroundColor: '#E8E6DC' }}>
                {/* 纸质纹理背景 */}
                <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <filter id={`paper-texture-${month.id}`}>
                            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
                            <feDiffuseLighting in="noise" lightingColor="#8B7355" surfaceScale="1">
                                <feDistantLight azimuth="45" elevation="60" />
                            </feDiffuseLighting>
                        </filter>
                        <rect width="100%" height="100%" filter={`url(#paper-texture-${month.id})`} opacity="0.15" />
                    </svg>
                </div>

                {/* 装饰性色块 - 使用网站强调色 */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
                        style={{ backgroundColor: '#8B3A3A' }} />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl"
                        style={{ backgroundColor: '#A67C52' }} />
                </div>

                {/* 书籍封面拼贴 - 多图层叠效果 */}
                {previewCards.length > 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center px-10 pt-12 pb-24">
                        {/* 根据图片数量创建拼贴布局 - 优化位置避免重叠 */}
                        {previewCards.length >= 4 && (
                            <motion.div
                                className="absolute w-1/3 aspect-[2/3] rounded-md shadow-lg"
                                initial={{ opacity: 0, scale: 0.8, x: '50%', y: '-25%', rotateZ: 18 }}
                                animate={{ opacity: 0.5, scale: 1, x: '50%', y: '-25%', rotateZ: 18 }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    zIndex: 1
                                }}
                            >
                                <Image
                                    src={previewCards[3]}
                                    alt="Book 4"
                                    fill
                                    className="object-cover rounded-md"
                                    sizes="150px"
                                />
                            </motion.div>
                        )}

                        {previewCards.length >= 3 && (
                            <motion.div
                                className="absolute w-1/3 aspect-[2/3] rounded-md shadow-lg"
                                initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-20%', rotateZ: -15 }}
                                animate={{ opacity: 0.6, scale: 1, x: '-50%', y: '-20%', rotateZ: -15 }}
                                transition={{ delay: 0.15 }}
                                style={{
                                    zIndex: 2
                                }}
                            >
                                <Image
                                    src={previewCards[2]}
                                    alt="Book 3"
                                    fill
                                    className="object-cover rounded-md"
                                    sizes="150px"
                                />
                            </motion.div>
                        )}

                        {previewCards.length >= 2 && (
                            <motion.div
                                className="absolute w-2/5 aspect-[2/3] rounded-md shadow-xl"
                                initial={{ opacity: 0, scale: 0.8, x: '25%', y: '-5%', rotateZ: 8 }}
                                animate={{ opacity: 0.75, scale: 1, x: '25%', y: '-5%', rotateZ: 8 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    zIndex: 3
                                }}
                            >
                                <Image
                                    src={previewCards[1]}
                                    alt="Book 2"
                                    fill
                                    className="object-cover rounded-md"
                                    sizes="150px"
                                />
                            </motion.div>
                        )}

                        {/* 主封面图 - 最前面的书 */}
                        <motion.div
                            className="relative w-3/5 aspect-[2/3] rounded-md shadow-2xl"
                            initial={{ opacity: 0, scale: 0.9, rotateZ: -5 }}
                            animate={{
                                opacity: 1,
                                scale: isHovered ? 1.05 : 1,
                                rotateZ: isHovered ? 0 : -2
                            }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                            style={{ zIndex: 10 }}
                        >
                            <Image
                                src={previewCards[0]}
                                alt={month.label}
                                fill
                                className="object-cover rounded-md"
                                priority
                                sizes="(max-width: 768px) 60vw, 300px"
                            />
                            {/* 边框装饰 */}
                            <div className="absolute inset-0 rounded-md border-2 border-white/10" />
                        </motion.div>
                    </div>
                ) : (
                    // 优雅的空状态设计
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center" style={{ color: '#8B3A3A' }}>
                            <svg className="w-24 h-24 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <p className="font-display text-sm opacity-40">等待书籍归档</p>
                        </div>
                    </div>
                )}

                {/* 半透明遮罩 - 确保文字可读，使用网站配色 */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(44, 44, 44, 0.92) 0%, rgba(44, 44, 44, 0.55) 45%, transparent 80%)' }} />

                {/* 文字信息层 */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 pb-11 pointer-events-none"
                    style={{ color: '#F2F0E9', zIndex: 30 }}>
                    {isLatest && (
                        <motion.div
                            className="inline-flex items-center gap-2 mb-4 w-fit"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium border"
                                style={{
                                    backgroundColor: 'rgba(139, 58, 58, 0.3)',
                                    borderColor: 'rgba(139, 58, 58, 0.5)',
                                    color: '#F2F0E9',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                                }}>
                                最新期
                            </span>
                        </motion.div>
                    )}

                    <motion.h1
                        className="font-display text-4xl md:text-5xl mb-3"
                        style={{
                            textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
                            color: '#F2F0E9'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {month.label}
                    </motion.h1>

                    <motion.p
                        className="font-body text-xl md:text-2xl mb-2"
                        style={{
                            color: 'rgba(242, 240, 233, 0.9)',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {month.vol}
                    </motion.p>

                    {month.bookCount > 0 && (
                        <motion.p
                            className="font-body text-sm"
                            style={{
                                color: 'rgba(242, 240, 233, 0.8)',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            收录 {month.bookCount} 本书
                        </motion.p>
                    )}
                </div>

                {/* 点击提示 */}
                <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <span className="text-sm font-body" style={{ color: '#8B3A3A' }}>点击进入本期 →</span>
                </motion.div>
            </div>
        </motion.div>
    );
}
