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
    const sleepingMatch = month.match(/^(\d{4})-sleeping-(.+)$/);

    if (subjectMatch) {
        const [_, year, name] = subjectMatch;
        // name is already decoded from the URL parameter, no need to decode again
        filePath = path.join(process.cwd(), 'public', 'content', year, 'subject', name, 'metadata.json');
        console.log('[DEBUG getMonthData] subject name:', name);
        console.log('[DEBUG getMonthData] subject filePath:', filePath);

        // Debug: check if file exists
        try {
            await fs.access(filePath);
            console.log('[DEBUG getMonthData] file exists:', filePath);
        } catch (accessError) {
            console.error('[DEBUG getMonthData] file does not exist:', filePath);
            // Try alternative approach: maybe we need to handle encoding differently
            console.log('[DEBUG getMonthData] trying encoded path...');
            const encodedName = encodeURIComponent(name);
            const encodedPath = path.join(process.cwd(), 'public', 'content', year, 'subject', encodedName, 'metadata.json');
            console.log('[DEBUG getMonthData] encoded path:', encodedPath);
            try {
                await fs.access(encodedPath);
                filePath = encodedPath;
                console.log('[DEBUG getMonthData] using encoded path:', filePath);
            } catch (encodedError) {
                console.error('[DEBUG getMonthData] neither path works');
            }
        }
    } else if (sleepingMatch) {
        const [_, year, name] = sleepingMatch;
        // name is already decoded from the URL parameter, no need to decode again
        filePath = path.join(process.cwd(), 'public', 'content', year, 'new', name, 'metadata.json');
        console.log('[DEBUG getMonthData] sleeping name:', name);
        console.log('[DEBUG getMonthData] sleeping filePath:', filePath);
    } else {
        const monthMatch = month.match(/^(\d{4})-\d{2}$/);
        if (monthMatch) {
            const year = monthMatch[1];
            filePath = path.join(process.cwd(), 'public', 'content', year, month, 'metadata.json');
        } else if (month === 'new') {
            // Special handling for 'new' directory - it doesn't have metadata.json directly
            // Return empty array as 'new' itself is not a valid content directory
            return [];
        } else {
            // Fallback
            filePath = path.join(process.cwd(), 'public', 'content', month, 'metadata.json');
        }
    }

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        const books = data.map((item: any) => transformMetadataToBook(item, month));
        console.log('[DEBUG getMonthData] transformed books:', books);
        return books;
    } catch (error) {
        console.error(`Error loading data for month ${month}:`, error);
        return [];
    }
}

export default async function MonthPage({ params }: PageProps) {
    const { month } = await params;
    // Decode month param just in case
    const decodedMonth = decodeURIComponent(month);
    console.log('[DEBUG MonthPage] original month param:', month);
    console.log('[DEBUG MonthPage] decodedMonth:', decodedMonth);
    console.log('[DEBUG MonthPage] raw param type:', typeof month);

    // Additional debug info for subject params
    if (decodedMonth.includes('-subject-')) {
        const subjectMatch = decodedMonth.match(/^(\d{4})-subject-(.+)$/);
        if (subjectMatch) {
            console.log('[DEBUG MonthPage] subject year:', subjectMatch[1]);
            console.log('[DEBUG MonthPage] subject name:', subjectMatch[2]);
            console.log('[DEBUG MonthPage] subject name length:', subjectMatch[2].length);
        }
    }

    const books = await getMonthData(decodedMonth);
    console.log('[DEBUG MonthPage] books count:', books.length);
    if (books.length > 0) {
        console.log('[DEBUG MonthPage] first book month:', books[0].month);
    }

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
                .filter(e => e.isDirectory() && e.name !== 'subject' && e.name !== 'new' && !e.name.startsWith('.'))
                .forEach(e => params.push({ month: e.name }));

            // Subjects
            const subjectDirEntry = entries.find(e => e.isDirectory() && e.name === 'subject');
            if (subjectDirEntry) {
                const subjectPath = path.join(yearPath, 'subject');
                const subjectEntries = await fs.readdir(subjectPath, { withFileTypes: true });
                subjectEntries
                    .filter(e => e.isDirectory())
                    .forEach(e => {
                        const route = `${year}-subject-${encodeURIComponent(e.name)}`;
                        console.log('[DEBUG Static Params] Adding subject route:', route);
                        params.push({ month: route });
                    });
            }

            // Sleeping Beauties (new)
            const sleepingDirEntry = entries.find(e => e.isDirectory() && e.name === 'new');
            if (sleepingDirEntry) {
                const sleepingPath = path.join(yearPath, 'new');
                const sleepingEntries = await fs.readdir(sleepingPath, { withFileTypes: true });
                sleepingEntries
                    .filter(e => e.isDirectory())
                    .forEach(e => params.push({ month: `${year}-sleeping-${e.name}` }));
            }
        }
    } catch (e) {
        console.error("Error generating static params:", e);
    }
    return params;
}
