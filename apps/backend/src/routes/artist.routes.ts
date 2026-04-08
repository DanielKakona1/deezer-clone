import { Router } from 'express';

import {
  getAlbums,
  getArtist,
  getArtistSearch,
  getArtistTop,
  getTrackSearch,
} from '../controllers/artist.controller';

const artistRouter = Router();

artistRouter.get('/search', getTrackSearch);
artistRouter.get('/search/artists', getArtistSearch);
artistRouter.get('/artists/:artistId', getArtist);
artistRouter.get('/artists/:artistId/top-tracks', getArtistTop);
artistRouter.get('/artists/:artistId/albums', getAlbums);

export { artistRouter };
