import { Request, Response } from 'express';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import mongoose from 'mongoose';

import Album, { TAlbum } from './album.model';
import Photo from '../photo/photo.model';
import { s3Client } from '../util/s3Setup';

export const getVisibleAlbums = async (
  _req: Request,
  res: Response<TAlbum[]>
) => {
  const visibleAlbums: TAlbum[] = await Album.aggregate([
    { $match: { isPublished: true } },
    {
      $lookup: {
        from: 'photos',
        localField: 'photos',
        foreignField: '_id',
        as: 'photos',
      },
    },
    {
      $set: {
        id: '$_id',
        totalPhotos: { $size: '$photos' },
        thumbnail: {
          $max: {
            $map: {
              input: '$photos',
              in: {
                likes: { $size: '$$this.likes' },
                url: '$$this.url',
              },
            },
          },
        },
      },
    },
    {
      $unset: ['_id', '__v', 'photos'],
    },
  ]);

  res.json(visibleAlbums);
};

export const getAllAlbums = async (_req: Request, res: Response<TAlbum[]>) => {
  const allAlbums: TAlbum[] = await Album.aggregate([
    {
      $lookup: {
        from: 'photos',
        localField: 'photos',
        foreignField: '_id',
        as: 'photos',
      },
    },
    {
      $set: {
        id: '$_id',
        totalPhotos: { $size: '$photos' },
        thumbnail: {
          $max: {
            $map: {
              input: '$photos',
              in: {
                likes: { $size: '$$this.likes' },
                url: '$$this.url',
              },
            },
          },
        },
      },
    },
    {
      $unset: ['_id', '__v', 'photos'],
    },
  ]);

  res.json(allAlbums);
};

export const getAlbumPhotosById = async (
  req: Request,
  res: Response<TAlbum>
) => {
  const { aid: albumId } = req.params;
  const { lid: likeId } = req.query;
  const objId = new mongoose.Types.ObjectId(albumId);

  const album: TAlbum[] = await Album.aggregate([
    { $match: { _id: objId } },
    { $limit: 1 },
    {
      $lookup: {
        from: 'photos',
        localField: 'photos',
        foreignField: '_id',
        as: 'photos',
        pipeline: [
          {
            $set: {
              id: '$_id',
              likes: [
                { $size: '$likes' },
                {
                  $toBool: {
                    $in: [likeId, '$likes'],
                  },
                },
              ],
            },
          },
          {
            $unset: ['_id', '__v', 'album'],
          },
        ],
      },
    },
    {
      $set: {
        id: '$_id',
        totalPhotos: { $size: '$photos' },
      },
    },
    {
      $unset: ['_id', '__v'],
    },
  ]);

  if (!album || album.length === 0) {
    res.status(404);
    throw new Error('Album not found.');
  }

  res.json(album[0]);
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
    throw new Error('Album not found.');
  }

  res.json(updatedAlbum);
};

export const deleteAlbumById = async (req: Request, res: Response<{}>) => {
  const { aid: albumId } = req.params;
  const objId = new mongoose.Types.ObjectId(albumId);

  const deletedAlbum = await Album.findByIdAndRemove(albumId);
  if (!deletedAlbum) {
    res.status(404);
    throw new Error('Album not found.');
  }

  const photosToBeDeleted = await Photo.aggregate([
    {
      $match: { album: objId },
    },
    {
      $project: {
        _id: 0,
        Key: '$url',
      },
    },
  ]);

  if (photosToBeDeleted.length === 0) {
    return res.status(204).end();
  }

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
