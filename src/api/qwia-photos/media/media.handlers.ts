import { Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

import Album from '../album/album.model';
import { s3Client } from '../util/s3Setup';

type MediaResponse = {
  uploadUrl: string;
  key: string;
};

export const getS3SignedUrl = async (
  req: Request,
  res: Response<MediaResponse>
) => {
  const { aid: albumId } = req.params;
  const { filetype } = req.query;

  const album = await Album.findById(albumId);

  if (!album) {
    res.status(404);
    throw new Error('Album not found.');
  }

  if (!filetype) {
    res.status(400);
    throw new Error('Missing query parameter.');
  }

  const fileExtension = (filetype as string).split('/')[1];

  if (!fileExtension) {
    res.status(400);
    throw new Error('Invalid query parameter.');
  }

  const fileName = `${albumId}/${nanoid()}.${fileExtension}`;

  const bucketParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: `image/${fileExtension}`,
  };

  const command = new PutObjectCommand(bucketParams);
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  res.json({
    uploadUrl,
    key: fileName,
  });
};
