import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const subject = searchParams.get('subject');
    
    console.log('[DEBUG API] Year:', year, 'Subject:', subject);
    
    if (!year || !subject) {
        console.log('[DEBUG API] Missing parameters');
        return Response.json({ error: 'Missing year or subject parameter' }, { status: 400 });
    }
    
    try {
        const subjectDir = path.join(process.cwd(), 'public', 'content', year, 'subject', subject);
        console.log('[DEBUG API] Subject directory path:', subjectDir);
        
        // 检查目录是否存在
        try {
            await fs.access(subjectDir);
            console.log('[DEBUG API] Directory exists');
        } catch (accessError) {
            console.log('[DEBUG API] Directory does not exist:', accessError);
            return Response.json({ error: 'Directory not found' }, { status: 404 });
        }
        
        const files = await fs.readdir(subjectDir);
        console.log('[DEBUG API] All files in directory:', files);
        
        const mdFiles = files.filter(file => file.endsWith('.md'));
        console.log('[DEBUG API] MD files found:', mdFiles);
        
        return Response.json(mdFiles);
    } catch (error) {
        console.error('[DEBUG API] Error listing MD files:', error);
        return Response.json({ error: 'Failed to list files' }, { status: 500 });
    }
}