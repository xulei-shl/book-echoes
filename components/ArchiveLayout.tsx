'use client';

import { ReactNode } from 'react';
import ArchiveYearNav from './ArchiveYearNav';

interface ArchiveLayoutProps {
    years: string[];
    children: ReactNode;
}

export default function ArchiveLayout({ years, children }: ArchiveLayoutProps) {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                {/* Left Sidebar - Year Navigation */}
                <aside className="md:col-span-2 hidden md:block">
                    <ArchiveYearNav years={years} />
                </aside>

                {/* Right Content - Cover Grid */}
                <main className="md:col-span-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
