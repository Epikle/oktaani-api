import { Request, Response } from 'express';

import Album, { TAlbum } from './album.model';

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

  const createdAlbum = new Album({ title: title.trim() });
  const savedAlbum = await createdAlbum.save();

  res.status(201).json(savedAlbum);
};

export const updateAlbumById = async (req: Request, res: Response<TAlbum>) => {
  const { aid: albumId } = req.params;
  const { title, isPublished }: { title: string; isPublished: boolean } =
    req.body;

  const updatedAlbum = await Album.findByIdAndUpdate(
    albumId,
    { title: title.trim(), isPublished },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedAlbum) throw new Error('Album not found!');

  res.json(updatedAlbum);
};

export const deleteAlbumById = async (req: Request, res: Response<{}>) => {
  const { aid: albumId } = req.params;

  const result = await Album.findByIdAndRemove(albumId);
  if (!result) throw new Error('Album not found!');

  //TODO: Need to also delete images from S3...

  res.status(204).end();
};
