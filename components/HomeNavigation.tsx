'use client';

import Link from 'next/link';
import AboutOverlay from './AboutOverlay';
import { motion } from 'framer-motion';

interface HomeNavigationProps {
    aboutContent: string;
}

export default function HomeNavigation({ aboutContent }: HomeNavigationProps) {
    return (
        <motion.div
            className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 drop-shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
        >
            <Link
                href="/archive"
                className="font-display text-lg md:text-xl text-[#F2F0E9] hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 hover:scale-105"
            >
                往期回顾
            </Link>

            <div>
                <AboutOverlay
                    content={aboutContent}
                    triggerClassName="!bg-transparent !border-none !shadow-none !p-0 !text-[#F2F0E9] !font-display !text-lg md:!text-xl hover:!text-white hover:!drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] hover:!bg-transparent hover:!scale-105 !backdrop-blur-none transition-all duration-300"
                />
            </div>

            <div className="mt-4 text-right">
                <p className="font-body text-xs text-[#F2F0E9]/80">
                    书海回响 — 那些被悄悄归还的一本好书
                </p>
                <p className="font-body text-xs text-[#F2F0E9]/80">
                    @ 上海图书馆
                </p>
            </div>
        </motion.div>
    );
}
