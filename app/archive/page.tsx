import { getMonths, getAboutContent } from '@/lib/content';
import ArchiveLayout from '@/components/ArchiveLayout';
import MagazineCard from '@/components/MagazineCard';
import Header from '@/components/Header';

export const metadata = {
    title: '往期回顾 | 书海回响',
    description: '书海回响往期期刊归档',
};

export default async function ArchivePage() {
    const months = await getMonths();
    const aboutContent = await getAboutContent();

    // Group months by year
    const monthsByYear: Record<string, typeof months> = {};
    months.forEach(month => {
        const year = month.id.split('-')[0];
        if (!monthsByYear[year]) {
            monthsByYear[year] = [];
        }
        monthsByYear[year].push(month);
    });

    const years = Object.keys(monthsByYear).sort((a, b) => b.localeCompare(a));

    return (
        <main className="relative min-h-screen bg-[var(--background)]">
            <Header showHomeButton={true} aboutContent={aboutContent} />

            <ArchiveLayout years={years}>
                {years.map(year => (
                    <section key={year} id={`year-${year}`} className="mb-20">
                        <h2 className="font-display text-3xl md:text-4xl text-[#8B3A3A] mb-8 border-b border-[#8B3A3A]/20 pb-4">
                            {year}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {monthsByYear[year].map(month => (
                                <MagazineCard key={month.id} month={month} className="h-[400px]" />
                            ))}
                        </div>
                    </section>
                ))}
            </ArchiveLayout>
        </main>
    );
}
