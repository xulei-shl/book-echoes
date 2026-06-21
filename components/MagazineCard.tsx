'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { MonthData } from '@/lib/content';

interface MagazineCardProps {
    month: MonthData;
    isLatest?: boolean;
    className?: string;
}

export default function MagazineCard({ month, isLatest = false, className = '' }: MagazineCardProps) {
    const router = useRouter();
    const [naturalRatio, setNaturalRatio] = useState<number | null>(null);
    const previewCards = month.previewCards;

    const onMainLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setNaturalRatio(img.naturalWidth / img.naturalHeight);
    }, []);

    // 默认回退到标准书籍比例 (2:3 = 0.667)
    const containerAspect = naturalRatio ?? (2 / 3);

    return (
        <div
            className={`relative w-full h-full flex flex-col justify-end cursor-pointer ${className}`}
            onClick={() => router.push(`/${month.id}`)}
        >
            <div className="absolute inset-0 z-0 flex items-center justify-center pb-8 pt-2 px-2 pointer-events-none">
                {previewCards.length > 0 ? (
                    <div className="relative w-[90%] h-[85%] flex items-center justify-center">
                        <Image
                            src={previewCards[0]}
                            alt={month.label}
                            fill
                            className="object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out-expo"
                            priority
                            sizes="(max-width: 768px) 80vw, 400px"
                            onLoad={onMainLoad}
                        />
                    </div>
                ) : (
                    <div className="text-center text-[#C9A063]/40">
                        <p className="font-display text-sm tracking-[0.2em] uppercase">No Records</p>
                    </div>
                )}
            </div>

            <div className="relative z-10 w-full mt-auto pointer-events-none">
                {isLatest && (
                    <div className="mb-3">
                        <span className="px-2 py-1 rounded-[2px] text-[9px] font-mono tracking-widest border border-[#C9A063]/40 text-[#C9A063] bg-[#C9A063]/5 uppercase">
                            Latest
                        </span>
                    </div>
                )}
                <div className="flex items-end justify-between border-t border-[#C9A063]/20 pt-4">
                    <span className="font-body text-base tracking-[0.15em] text-[#E8E6DC]/90 uppercase">{month.vol}</span>
                    {month.bookCount > 0 && (
                        <span className="font-mono text-[10px] tracking-[0.2em] text-[#C9A063]/60 uppercase">
                            {month.bookCount} Books
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
