import { Request, Response } from 'express';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import Album from '../album/album.model';
import Photo, { TPhoto } from './photo.model';
import { s3Client } from '../util/s3Setup';

export const createPhoto = async (req: Request, res: Response<TPhoto>) => {
  const { aid: albumId } = req.params;
  const { title, url }: { title: string; url: string } = req.body;

  const album = await Album.findById(albumId);

  if (!album) {
    res.status(404);
    throw new Error('Album not found.');
  }

  const photo = new Photo({
    title: title?.trim(),
    url: url?.trim(),
    album: album._id,
  });

  const savedPhoto = await photo.save();

  album.photos = album.photos.concat(savedPhoto._id);
  await album.save();

  res.status(201).json(savedPhoto);
};

export const updatePhotoById = async (req: Request, res: Response<TPhoto>) => {
  const { pid: photoId } = req.params;
  const { title }: { title: string } = req.body;

  const updatedPhoto = await Photo.findByIdAndUpdate(
    photoId,
    { title: title.trim() },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedPhoto) throw new Error('Photo not found.');

  res.json(updatedPhoto);
};

export const deletePhotoById = async (req: Request, res: Response<{}>) => {
  const { pid: photoId } = req.params;

  const photo = await Photo.findByIdAndRemove(photoId);
  if (!photo) {
    res.status(404);
    throw new Error('Photo not found.');
  }

  const albumId = photo.album.toString();
  const album = await Album.findById(albumId);
  if (!album) {
    res.status(404);
    throw new Error('Album not found.');
  }

  const filteredPhotoList = album.photos.filter(
    (id: string) => photoId !== id.toString()
  );

  album.photos = filteredPhotoList;
  await album.save();

  const bucketParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${albumId}/${photoId}`,
  };
  const command = new DeleteObjectCommand(bucketParams);
  await s3Client.send(command);

  res.status(204).end();
};

export const addLikeToPhotoById = async (req: Request, res: Response<{}>) => {
  const { pid: photoId } = req.params;
  const { lid: likeId }: { lid: string } = req.body;

  if (!likeId || likeId.trim() === '') {
    res.status(400);
    throw new Error('Missing like id.');
  }

  const photo = await Photo.findById(photoId);

  if (!photo) {
    res.status(404);
    throw new Error('Photo not found.');
  }

  if (photo.likes?.includes(likeId)) {
    res.status(409);
    throw new Error('Photo is already liked with this like id.');
  }

  photo.likes = photo.likes?.concat(likeId.trim());
  await photo.save();

  res.status(201).end();
};

export const deleteLikeFromPhotoById = async (
  req: Request,
  res: Response<{}>
) => {
  const { pid: photoId } = req.params;
  const { lid: likeId } = req.query;

  if (!likeId) {
    res.status(400);
    throw new Error('Missing like id.');
  }

  const photo = await Photo.findById(photoId);

  if (!photo) {
    res.status(404);
    throw new Error('Photo not found.');
  }

  photo.likes = photo.likes?.filter((id) => id !== likeId);
  await photo.save();

  res.status(201).end();
};
