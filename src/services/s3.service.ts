import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3_ENDPOINT, S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY } from '../config';

export class S3Service {
    private static instance: S3Service;
    private s3Client: S3Client;

    private constructor() {
        this.s3Client = new S3Client({
            endpoint: S3_ENDPOINT,
            region: S3_REGION,
            credentials: {
                accessKeyId: S3_ACCESS_KEY,
                secretAccessKey: S3_SECRET_KEY,
            },
            forcePathStyle: true,
        });
    }

    public static getInstance(): S3Service {
        if (!S3Service.instance) {
            S3Service.instance = new S3Service();
        }
        return S3Service.instance;
    }

    async uploadFile(file: Buffer, key: string | null): Promise<string> {
        if (!key) {
            key = Math.random().toString(36).substring(7);
        }
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            Body: file,
        });

        try {
            await this.s3Client.send(command);
            return `${S3_ENDPOINT}/${S3_BUCKET}/${key}`;
        } catch (error) {
            console.error('Error in uploadFile:', error);
            throw error;
        }
    }
}