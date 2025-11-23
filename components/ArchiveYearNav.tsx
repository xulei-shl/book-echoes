'use client';

import { motion } from 'framer-motion';

interface ArchiveYearNavProps {
    years: string[];
    activeYear?: string;
}

export default function ArchiveYearNav({ years, activeYear }: ArchiveYearNavProps) {
    const scrollToYear = (year: string) => {
        const element = document.getElementById(`year-${year}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="sticky top-32 flex flex-col gap-4">
            {years.map((year) => (
                <motion.button
                    key={year}
                    onClick={() => scrollToYear(year)}
                    className={`text-left font-display text-2xl md:text-3xl transition-colors duration-300 ${activeYear === year ? 'text-[#8B3A3A]' : 'text-gray-500 hover:text-[#E8E6DC]'
                        }`}
                    whileHover={{ x: 5 }}
                >
                    {year}
                </motion.button>
            ))}
        </nav>
    );
}
