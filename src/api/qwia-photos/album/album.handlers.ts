import { Request, Response } from 'express';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';

import Album, { TAlbum } from './album.model';
import Photo from '../photo/photo.model';
import { s3Client } from '../util/s3Setup';

export const getVisibleAlbums = async (
  _req: Request,
  res: Response<TAlbum[]>
) => {
  const visibleAlbums = await Album.find({ isPublished: true });
  res.json(visibleAlbums);
};

export const getAllAlbums = async (_req: Request, res: Response<TAlbum[]>) => {
  const allAlbums = await Album.find({});
  res.json(allAlbums);
};

export const getAlbumPhotosById = async (
  req: Request,
  res: Response<TAlbum>
) => {
  const { aid: albumId } = req.params;

  const album = await Album.findById(albumId).populate('photos', { album: 0 });
  if (!album) throw new Error('Album not found!');

  res.json(album);
};

export const createAlbum = async (req: Request, res: Response<TAlbum>) => {
  const { title }: { title: string } = req.body;

  const createdAlbum = new Album({ title: title?.trim() });
  const savedAlbum = await createdAlbum.save();

  res.status(201).json(savedAlbum);
};

export const updateAlbumById = async (req: Request, res: Response<TAlbum>) => {
  const { aid: albumId } = req.params;
  const { title, isPublished }: { title: string; isPublished: boolean } =
    req.body;

  const updatedAlbum = await Album.findByIdAndUpdate(
    albumId,
    { title: title?.trim(), isPublished },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedAlbum) {
    res.status(404);
    throw new Error('Album not found!');
  }

  res.json(updatedAlbum);
};

export const deleteAlbumById = async (req: Request, res: Response<{}>) => {
  const { aid: albumId } = req.params;

  const deletedAlbum = await Album.findByIdAndRemove(albumId);
  if (!deletedAlbum) {
    res.status(404);
    throw new Error('Album not found!');
  }

  const photosToBeDeleted = await Photo.aggregate([
    {
      $project: {
        _id: 0,
        Key: '$url',
      },
    },
  ]);

  await Photo.deleteMany({ album: albumId });

  const bucketParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Delete: {
      Objects: photosToBeDeleted,
    },
  };

  const command = new DeleteObjectsCommand(bucketParams);
  await s3Client.send(command);

  res.status(204).end();
};
