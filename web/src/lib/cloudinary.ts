import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadOptions = {
    folder?: string;
    fileName?: string;
    fileType?: string;
};

export async function uploadFile(
    buffer: Buffer,
    options: UploadOptions = {}
){
    return new Promise<{
        url: string;
        public_id: string;
        fileType: string;
        fileName: string;
        fileSize: number;
    }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder || 'uploads',
                resource_type: 'auto',
            },
            (error, result) => {
                if(error || !result){
                    return reject(error || new Error('Upload failed'));
                }

                const isPdf =
                    result.format === 'pdf' ||
                    options.fileType === 'pdf' ||
                    (options.fileName && options.fileName.toLowerCase().endsWith('.pdf')) ||
                    (result.secure_url && result.secure_url.toLowerCase().endsWith('.pdf'));

                const resolvedType = isPdf
                    ? 'pdf'
                    : (options.fileType || result.resource_type || 'document');

                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                    fileType: resolvedType,
                    fileName: options.fileName || result.original_filename || 'uploaded-file',
                    fileSize: result.bytes,
                });
            }
        );
        uploadStream.end(buffer);
    });
}
