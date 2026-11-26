import { NextResponse } from 'next/server';

import { requireAuth } from '@/middleware/auth';
import { uploadFile } from '@/lib/cloudinary';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req: Request) {
    try{
        await requireAuth(req);

        const formData = await req.formData();

        const file = formData.get('file');

        if(!file || !(file instanceof File)){
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        if(file.size > MAX_FILE_SIZE){
            return NextResponse.json(
                { error: 'File size exceeds the limit of 10MB' },
                { status: 400 }
            );
        }

        if(!ALLOWED_TYPES.includes(file.type)){
            return NextResponse.json(
                { error: 'Only images, PDFs, and documents are allowed' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        const fileKind = file.type === "application/pdf"
            ? "pdf"
            : file.type.startsWith("image/")
            ? "image"
            : "document";

        const uploadedFile = await uploadFile(buffer, {
            folder: 'metacourt/evidence',
            fileName: file.name,
            fileType: fileKind,
        });

        return NextResponse.json(
            { message: 'File uploaded successfully', file: uploadedFile },
            { status: 201 }
        );
    }catch(error){
        console.error("Upload error:", error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
