import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve uploaded images (in a real app, use S3/Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Valentine Server is running' });
});

// --- API Routes ---

// Create Page
interface CreatePageBody {
    slug: string;
    partnerName: string;
    yourName: string;
    relationshipDate?: string;
    themeColor: string;
    passwordHash?: string;
    bgMusicUrl?: string;
    loveLetter: string;
    photos: { url: string }[];
    reasons: { text: string }[];
}

app.post('/api/create', async (req: Request<{}, {}, CreatePageBody>, res: Response) => {
    try {
        const {
            slug, partnerName, yourName, relationshipDate,
            themeColor, passwordHash, bgMusicUrl, loveLetter,
            photos, reasons
        } = req.body;

        const page = await prisma.lovePage.create({
            data: {
                slug,
                partnerName,
                yourName,
                relationshipDate: relationshipDate ? new Date(relationshipDate) : null,
                themeColor,
                passwordHash,
                bgMusicUrl,
                loveLetter,
                photos: {
                    create: photos.map((p: any) => ({ url: p.url }))
                },
                reasons: {
                    create: reasons.map((r: any) => ({ text: r.text }))
                }
            }
        });

        res.json({ success: true, slug: page.slug });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create page' });
    }
});

// Get Page
app.get('/api/page/:slug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params as { slug: string };
        const page = await prisma.lovePage.findUnique({
            where: { slug },
            include: { photos: true, reasons: true }
        });

        if (!page) return res.status(404).json({ error: 'Page not found' });

        // If password protected, don't return content yet
        if (page.passwordHash) {
            return res.json({
                isLocked: true,
                prompt: `${page.yourName} has protected this page.`
            });
        }

        res.json(page);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch page' });
    }
});

// Unlock Page
interface UnlockBody {
    slug: string;
    password?: string;
}

app.post('/api/unlock', async (req: Request<{}, {}, UnlockBody>, res: Response) => {
    const { slug, password } = req.body;
    const page = await prisma.lovePage.findUnique({
        where: { slug },
        include: { photos: true, reasons: true }
    });

    if (!page) return res.status(404).json({ error: 'Page not found' });

    // Simple comparison (in production use bcrypt)
    if (page.passwordHash === password) {
        res.json(page);
    } else {
        res.status(401).json({ error: 'Incorrect password' });
    }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Export the app for Vercel
export default app;

// Only listen if running directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
