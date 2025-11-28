import { promises as fs } from 'fs';
import path from 'path';
import Canvas from '@/components/Canvas';
import { Book } from '@/types';
import { transformMetadataToBook } from '@/lib/utils';

export const revalidate = 3600;
export const dynamic = 'force-static';

interface PageProps {
    params: Promise<{
        month: string;
    }>;
}

// Function to get data for a specific month
async function getMonthData(month: string): Promise<Book[]> {
    let filePath = '';

    const subjectMatch = month.match(/^(\d{4})-subject-(.+)$/);
    if (subjectMatch) {
        const [_, year, name] = subjectMatch;
        filePath = path.join(process.cwd(), 'public', 'content', year, 'subject', decodeURIComponent(name), 'metadata.json');
    } else {
        const monthMatch = month.match(/^(\d{4})-\d{2}$/);
        if (monthMatch) {
            const year = monthMatch[1];
            filePath = path.join(process.cwd(), 'public', 'content', year, month, 'metadata.json');
        } else {
            // Fallback
            filePath = path.join(process.cwd(), 'public', 'content', month, 'metadata.json');
        }
    }

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        return data.map((item: any) => transformMetadataToBook(item, month));
    } catch (error) {
        console.error(`Error loading data for month ${month}:`, error);
        return [];
    }
}

export default async function MonthPage({ params }: PageProps) {
    const { month } = await params;
    // Decode month param just in case
    const decodedMonth = decodeURIComponent(month);
    const books = await getMonthData(decodedMonth);

    if (!books || books.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-[var(--background)] text-[var(--foreground)]">
                <h1 className="font-display text-2xl">Month not found or empty</h1>
            </div>
        );
    }

    return <Canvas books={books} month={decodedMonth} />;
}

export async function generateStaticParams() {
    const contentDir = path.join(process.cwd(), 'public', 'content');
    const params: { month: string }[] = [];

    try {
        const yearEntries = await fs.readdir(contentDir, { withFileTypes: true });
        const yearDirs = yearEntries
            .filter(entry => entry.isDirectory() && /^\d{4}$/.test(entry.name))
            .map(entry => entry.name);

        for (const year of yearDirs) {
            const yearPath = path.join(contentDir, year);
            const entries = await fs.readdir(yearPath, { withFileTypes: true });

            // Months
            entries
                .filter(e => e.isDirectory() && e.name !== 'subject' && !e.name.startsWith('.'))
                .forEach(e => params.push({ month: e.name }));

            // Subjects
            const subjectDirEntry = entries.find(e => e.isDirectory() && e.name === 'subject');
            if (subjectDirEntry) {
                const subjectPath = path.join(yearPath, 'subject');
                const subjectEntries = await fs.readdir(subjectPath, { withFileTypes: true });
                subjectEntries
                    .filter(e => e.isDirectory())
                    .forEach(e => params.push({ month: `${year}-subject-${e.name}` }));
            }
        }
    } catch (e) {
        console.error("Error generating static params:", e);
    }
    return params;
}
