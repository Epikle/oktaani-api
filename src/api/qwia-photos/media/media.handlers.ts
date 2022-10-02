import { Request, Response } from 'express';
import S3 from 'aws-sdk/clients/s3';
import { nanoid } from 'nanoid';

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
  signatureVersion: 'v4',
});

type MediaResponse = {
  uploadUrl: string;
  key: string;
};

export const getS3SignedUrl = (req: Request, res: Response<MediaResponse>) => {
  if (!req.query.filetype) {
    res.status(400);
    throw new Error('Missing query parameter.');
  }

  const fileExtension = (req.query.filetype as string).split('/')[1];

  if (!fileExtension) {
    res.status(400);
    throw new Error('Invalid query parameter.');
  }

  const fileName = `${nanoid()}.${fileExtension}`;

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: `image/${fileExtension}`,
  };

  const uploadUrl = s3.getSignedUrl('putObject', s3Params);

  res.json({
    uploadUrl,
    key: fileName,
  });
};
