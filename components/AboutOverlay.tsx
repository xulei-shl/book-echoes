'use client';

import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';

interface AboutOverlayProps {
    content: string;
    isOpen: boolean;
    onClose: () => void;
}

const markdownComponents: Components = {
    h1: (props) => (
        <h1
            className="font-display text-4xl md:text-5xl text-[#8B3A3A] tracking-wide mb-8 border-b border-[#8B3A3A]/20 pb-4"
            {...props}
        />
    ),
    h2: (props) => (
        <h2
            className="font-display text-2xl md:text-3xl text-[#E8E6DC] mt-10 mb-4 flex items-center gap-3"
            {...props}
        >
            <span className="w-1.5 h-1.5 bg-[#8B3A3A] rounded-sm" />
            {props.children}
        </h2>
    ),
    h3: (props) => (
        <h3
            className="font-display text-xl text-[#E8E6DC]/90 mt-8 mb-3 tracking-wide"
            {...props}
        />
    ),
    p: (props) => (
        <p
            className="font-body text-lg leading-relaxed text-[#E8E6DC]/80 mb-6 whitespace-pre-wrap tracking-wide text-justify"
            {...props}
        />
    ),
    ul: (props) => (
        <ul className="list-none space-y-2 text-[#E8E6DC]/80 mb-6 tracking-wide" {...props} />
    ),
    ol: (props) => (
        <ol className="list-decimal list-inside space-y-2 text-[#E8E6DC]/80 mb-6 tracking-wide" {...props} />
    ),
    li: (props) => (
        <li className="font-body text-lg leading-relaxed flex gap-3" {...props}>
            <span className="text-[#8B3A3A] mt-2 text-xs">◆</span>
            <span>{props.children}</span>
        </li>
    ),
    hr: () => <div className="my-10 border-t border-[#8B3A3A]/20" />,
    strong: (props) => (
        <strong className="text-[#8B3A3A] font-medium" {...props} />
    ),
    em: (props) => (
        <em className="text-[#E8E6DC] italic font-serif" {...props} />
    ),
    blockquote: (props) => (
        <blockquote
            className="border-l-2 border-[#8B3A3A] pl-6 italic text-[#E8E6DC]/70 my-8 tracking-wide bg-[#8B3A3A]/5 py-4 pr-4"
            {...props}
        />
    ),
    table: (props) => (
        <div className="overflow-x-auto border border-[#8B3A3A]/20 my-8 bg-[#1a1a1a]">
            <table className="min-w-full divide-y divide-[#8B3A3A]/20" {...props} />
        </div>
    ),
    thead: (props) => (
        <thead className="bg-[#8B3A3A]/10 text-[#8B3A3A] uppercase text-xs tracking-widest font-mono" {...props} />
    ),
    tbody: (props) => <tbody className="divide-y divide-[#8B3A3A]/10" {...props} />,
    th: (props) => (
        <th className="px-4 py-3 text-left font-medium text-sm" {...props} />
    ),
    td: (props) => (
        <td className="px-4 py-3 text-sm text-[#E8E6DC]/80 align-top tracking-wide" {...props} />
    ),
    code: ({ inline, className, children, ...props }: any) => {
        if (inline) {
            return (
                <code
                    className={clsx(
                        'font-mono text-sm px-1.5 py-0.5 rounded bg-[#8B3A3A]/10 text-[#8B3A3A]',
                        className
                    )}
                    {...props}
                >
                    {children}
                </code>
            );
        }

        return (
            <pre className={clsx('bg-[#000000]/30 border border-[#8B3A3A]/20 p-4 overflow-x-auto text-sm text-[#E8E6DC]/80 my-6 tracking-wide font-mono', className)}>
                <code {...props}>{children}</code>
            </pre>
        );
    }
};

export default function AboutOverlay({ content, isOpen, onClose }: AboutOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-[#000000]/90 backdrop-blur-sm z-[140] pointer-events-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        id="about-overlay"
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-x-4 md:inset-x-20 lg:inset-x-32 top-12 bottom-12 bg-[#1a1a1a]/90 backdrop-blur-xl border border-[#8B3A3A]/30 overflow-hidden z-[150] pointer-events-auto flex flex-col"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8B3A3A] z-20" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8B3A3A] z-20" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#8B3A3A] z-20" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8B3A3A] z-20" />

                        {/* Background Watermark */}
                        <div className="absolute -bottom-20 -right-10 pointer-events-none select-none opacity-[0.03] z-0">
                            <span className="font-display text-[20rem] leading-none text-[#8B3A3A] block transform -rotate-12">
                                关于
                            </span>
                        </div>

                        {/* Header Bar */}
                        <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-[#8B3A3A]/20 relative z-10 bg-[#1a1a1a]">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-[#8B3A3A]" />
                                <span className="font-mono text-[#8B3A3A] tracking-[0.3em] text-sm uppercase">
                                    About
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="group relative w-10 h-10 flex items-center justify-center border border-[#8B3A3A]/30 hover:bg-[#8B3A3A] transition-colors duration-300"
                                aria-label="Close"
                            >
                                <span className="font-mono text-[#8B3A3A] group-hover:text-[#E8E6DC] text-xl transition-colors">×</span>
                                {/* Button Corner Accents */}
                                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-[#8B3A3A] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-[#8B3A3A] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="relative flex-1 overflow-hidden z-10">
                            <div className="about-overlay-scroll absolute inset-0 overflow-y-auto px-6 md:px-10 py-8">
                                <div className="max-w-4xl mx-auto">
                                    {content ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={markdownComponents}
                                        >
                                            {content}
                                        </ReactMarkdown>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#8B3A3A]/20 bg-[#8B3A3A]/5">
                                            <p className="font-mono text-[#8B3A3A] text-lg mb-2">NO_DATA_FOUND</p>
                                            <p className="text-[#8B3A3A]/50 text-sm">Please check public/About.md</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Spacing */}
                                <div className="h-20" />
                            </div>

                            {/* Bottom Fade */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none" />
                        </div>

                        {/* Footer Status Bar */}
                        <div className="px-6 md:px-10 py-3 border-t border-[#8B3A3A]/20 flex justify-between items-center bg-[#1a1a1a] relative z-10">
                            <span className="font-mono text-[10px] text-[#8B3A3A]/40 tracking-widest">
                                BOOK ECHOES SHANGHAI LIBRARY
                            </span>
                            <div className="flex gap-2">
                                <div className="w-1 h-1 bg-[#8B3A3A]/40 rounded-full animate-pulse" />
                                <div className="w-1 h-1 bg-[#8B3A3A]/40 rounded-full" />
                                <div className="w-1 h-1 bg-[#8B3A3A]/40 rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
