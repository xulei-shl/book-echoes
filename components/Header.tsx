'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AboutOverlay from './AboutOverlay';

interface HeaderProps {
    showHomeButton?: boolean;
    aboutContent?: string;
    theme?: 'light' | 'dark';
}

export default function Header({ showHomeButton = false, aboutContent, theme = 'light' }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const buttonStyles = theme === 'dark'
        ? "border-[#E8E6DC]/10 bg-[#1a1a1a]/90 text-[#E8E6DC] hover:bg-[#C9A063] hover:text-[#1a1a1a] focus-visible:ring-[#C9A063] focus-visible:ring-offset-[#1a1a1a]"
        : "border-white/10 bg-[var(--background)]/90 text-[var(--foreground)] hover:bg-[#C9A063] hover:text-white focus-visible:ring-[#C9A063] focus-visible:ring-offset-[var(--background)]";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
            <div className="relative flex items-center justify-between px-6 py-6 md:px-8 md:py-8">
                {/* Logo - Left */}
                {/* <motion.div
                    className="pointer-events-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-28 opacity-60 hover:opacity-75 transition-all duration-300">
                        <Image
                            src="/logozi_shl.jpg"
                            alt="机构Logo"
                            fill
                            className={`object-contain object-left grayscale-[30%] sepia-[15%] brightness-110 contrast-90 ${theme === 'dark' ? 'invert opacity-80' : ''}`}
                            priority
                        />
                    </div>
                </motion.div> */}

                {/* Spacer for center alignment */}
                <div className="flex-1" />

                {/* Center Group - Home & About Buttons */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-3 z-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {showHomeButton && (
                        <>
                            <button
                                onClick={() => router.push('/')}
                                className={`inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full border text-sm md:text-base font-body shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300 ${buttonStyles}`}
                                aria-label="返回首页"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                <span>首页</span>
                            </button>

                            {pathname !== '/archive' && (
                                <button
                                    onClick={() => router.push('/archive')}
                                    className={`inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full border text-sm md:text-base font-body shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300 ${buttonStyles}`}
                                    aria-label="往期回顾"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                    <span>往期</span>
                                </button>
                            )}
                        </>
                    )}

                    {/* Random Walk Button */}
                    {(pathname === '/archive' || (pathname && pathname !== '/' && !pathname.startsWith('/random'))) && (
                        <button
                            onClick={() => router.push('/random')}
                            className={`inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full border text-sm md:text-base font-body shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300 ${buttonStyles}`}
                            aria-label="随机漫步"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                            </svg>
                            <span>漫步</span>
                        </button>
                    )}

                    {/* About Button */}
                    {aboutContent && (
                        <button
                            onClick={() => setIsAboutOpen(true)}
                            className={`inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full border text-sm md:text-base font-body shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300 ${buttonStyles}`}
                            aria-label="关于"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>关于</span>
                        </button>
                    )}
                </motion.div>

                {/* About Overlay - Moved outside of motion.div to prevent transform context issues */}
                {aboutContent && (
                    <AboutOverlay
                        content={aboutContent}
                        isOpen={isAboutOpen}
                        onClose={() => setIsAboutOpen(false)}
                    />
                )}

                {/* Right spacer to balance layout */}
                <div className="flex-1" />
            </div>
        </header>
    );
}
