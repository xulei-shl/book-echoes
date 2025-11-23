'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HomeHeroProps {
    images: string[];
    targetLink: string;
    title: string;
    subtitle: string;
}

export default function HomeHero({ images, targetLink, title, subtitle }: HomeHeroProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 8000); // 每8秒切换一次,给图片更多加载和展示时间

        return () => clearInterval(timer);
    }, [images.length]);

    const handleImageError = () => {
        // If an image fails to load, we could remove it from the list or just ignore it.
        // For now, we'll just let the next one show up.
        console.warn(`Failed to load image at index ${currentIndex}`);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center cursor-pointer group"
            onClick={() => router.push(targetLink)}>

            {/* Background Image Carousel */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    {images.length > 0 && (
                        <motion.div
                            key={currentIndex}
                            className="absolute inset-0"
                            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
                            transition={{ duration: 2, ease: "easeInOut" }} // 延长过渡时间,使切换更平滑
                        >
                            <Image
                                src={images[currentIndex]}
                                alt={`Hero Image ${currentIndex + 1}`}
                                fill
                                className="object-cover opacity-80"
                                priority={currentIndex === 0}
                                onError={handleImageError}
                            />
                            {/* Overlay: 电影级渐变遮罩，顶部和底部加深以衬托文字，中间透亮 */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Central Visual Frame (Optional, if we want a frame effect) */}
            {/* For now, full screen immersive is requested. "转变为全屏的沉浸式展示" */}

            {/* Text Content */}
            <div className="relative z-10 text-center text-[#F2F0E9] mix-blend-difference px-4">
                <motion.h1
                    className="font-display text-6xl md:text-8xl lg:text-9xl mb-6 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    书海回响
                </motion.h1>

                <motion.p
                    className="font-body text-xl md:text-2xl tracking-[0.2em] opacity-90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                >
                    <span className="border border-[#F2F0E9] px-6 py-2 rounded-full text-sm tracking-widest uppercase hover:bg-[#F2F0E9] hover:text-black transition-colors">
                        Enter Issue
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
