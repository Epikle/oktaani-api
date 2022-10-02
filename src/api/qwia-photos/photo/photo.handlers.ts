import { Request, Response } from 'express';

import Album from '../album/album.model';
import Photo, { TPhoto } from './photo.model';

export const createPhoto = async (req: Request, res: Response<TPhoto>) => {
  const { aid: albumId } = req.params;
  const { title, url }: { title: string; url: string } = req.body;

  const album = await Album.findById(albumId);

  if (!album) throw new Error('Album not found!');

  const photo = new Photo({
    title: title.trim(),
    url: url.trim(),
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
  if (!updatedPhoto) throw new Error('Photo not found!');

  res.json(updatedPhoto);
};

export const deletePhotoById = async (req: Request, res: Response<{}>) => {
  const { pid: photoId } = req.params;

  const result = await Album.findByIdAndRemove(photoId);
  if (!result) throw new Error('Photo not found!');

  //TODO: delete photo also from S3

  res.status(204).end();
};
