'use client';

import { motion } from 'framer-motion';
import { Book } from '@/types';
import { useStore } from '@/store/useStore';

interface DockCardProps {
    book: Book;
    index: number;
    isHovered: boolean;
    cardRef: React.RefObject<HTMLDivElement | null>;
    onHoverStart: () => void;
    onHoverEnd: () => void;
}

export default function DockCard({
    book,
    index,
    isHovered,
    cardRef,
    onHoverStart,
    onHoverEnd
}: DockCardProps) {
    const { setFocusedBookId } = useStore();

    const normalizedTitle = book.title.trim();
    const normalizedSubtitle = book.subtitle?.trim();
    const dockLabel = normalizedSubtitle ? `${normalizedTitle} : ${normalizedSubtitle}` : normalizedTitle;
    const dockVerticalText = dockLabel.replace(/\s+/g, '').split('').join('\n');

    // 旋转细微的灰度色调,使每个标题感觉独特
    const toneSlot = index % 7;
    const dockOpacity = 0.5 + (toneSlot * 0.06); // 范围: 0.5 - 0.92
    const dockTextStyle = {
        color: '#E8E6DC',
        opacity: dockOpacity
    };

    return (
        <motion.div
            ref={cardRef}
            className="relative min-w-[20px] h-32 cursor-pointer transition-transform duration-200 ease-out flex items-end justify-center"
            onClick={() => setFocusedBookId(book.id)}
            whileHover={{ y: -10 }}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            style={{ zIndex: isHovered ? 120 : undefined }}
            title={dockLabel}
            aria-label={dockLabel}
        >
            <span
                className="font-dock text-lg tracking-[0.3em] leading-7 whitespace-pre text-center"
                style={dockTextStyle}
            >
                {dockVerticalText}
            </span>
        </motion.div>
    );
}
