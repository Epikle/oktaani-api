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

export const updatePhotoById = async (req: Request, res: Response<{}>) => {
  const { pid: photoId } = req.params;
  const { title }: { title: string } = req.body;

  console.log('update: ', photoId, title);
  //TODO: update title to db

  res.status(204).end();
};

export const deletePhotoById = async (req: Request, res: Response<{}>) => {
  const { pid: photoId } = req.params;

  console.log('delete: ', photoId);
  // if (!result) throw new Error('Album not found!');

  //TODO: delete photo from db
  //TODO: delete photo also from S3

  res.status(204).end();
};
