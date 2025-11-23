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
            className="font-display text-4xl md:text-5xl text-[#E8E6DC] tracking-wide mb-6"
            {...props}
        />
    ),
    h2: (props) => (
        <h2
            className="font-display text-2xl md:text-3xl text-[#E8E6DC] mt-10 mb-4 border-l-4 border-[#8B3A3A] pl-4"
            {...props}
        />
    ),
    h3: (props) => (
        <h3
            className="font-display text-xl text-[#E8E6DC] mt-8 mb-3"
            {...props}
        />
    ),
    p: (props) => (
        <p
            className="font-body leading-relaxed text-gray-300 mb-4 whitespace-pre-wrap"
            {...props}
        />
    ),
    ul: (props) => (
        <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6" {...props} />
    ),
    ol: (props) => (
        <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6" {...props} />
    ),
    li: (props) => (
        <li className="font-body leading-relaxed text-gray-300" {...props} />
    ),
    hr: () => <div className="my-10 border-t border-dashed border-white/10" />,
    strong: (props) => (
        <strong className="text-[#E8E6DC] font-semibold" {...props} />
    ),
    em: (props) => (
        <em className="text-[#8B3A3A] not-italic" {...props} />
    ),
    blockquote: (props) => (
        <blockquote
            className="border-l-4 border-[#8B3A3A]/40 pl-4 italic text-gray-400 my-6"
            {...props}
        />
    ),
    table: (props) => (
        <div className="overflow-x-auto rounded-2xl border border-white/10 my-6">
            <table className="min-w-full divide-y divide-gray-200" {...props} />
        </div>
    ),
    thead: (props) => (
        <thead className="bg-[#1a1a1a]/60 text-[#E8E6DC] uppercase text-xs tracking-widest" {...props} />
    ),
    tbody: (props) => <tbody className="divide-y divide-white/10" {...props} />,
    th: (props) => (
        <th className="px-4 py-3 text-left font-medium text-sm" {...props} />
    ),
    td: (props) => (
        <td className="px-4 py-3 text-sm text-gray-300 align-top" {...props} />
    ),
    code: ({ inline, className, children, ...props }: any) => {
        if (inline) {
            return (
                <code
                    className={clsx(
                        'font-mono text-sm px-1.5 py-0.5 rounded bg-white/10 text-[#8B3A3A]',
                        className
                    )}
                    {...props}
                >
                    {children}
                </code>
            );
        }

        return (
            <pre className={clsx('bg-black/20 rounded-2xl p-4 overflow-x-auto text-sm text-gray-300 my-6', className)}>
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[140]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        id="about-overlay"
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-x-4 md:inset-x-16 lg:inset-x-24 top-12 bottom-12 bg-[#1a1a1a]/95 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-[150]"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    >
                        <div className="flex items-start justify-between gap-6 mb-6 md:mb-10">
                            <div>
                                <p className="text-sm tracking-[0.4em] uppercase text-gray-400 mb-2">About</p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#1a1a1a]/80 text-[#E8E6DC] text-2xl hover:bg-[#8B3A3A] hover:text-[#E8E6DC] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B3A3A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] transition-all duration-300"
                                aria-label="关闭关于介绍"
                            >
                                ×
                            </button>
                        </div>

                        <div className="relative h-full">
                            <div className="about-overlay-scroll absolute inset-0 overflow-y-auto pr-3 pb-16">
                                {content ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">暂无关于内容</p>
                                        <p className="text-gray-400 text-sm mt-2">请检查 public/About.md 文件是否存在</p>
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
