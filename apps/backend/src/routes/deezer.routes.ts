import { Router } from 'express';

import { getAlbums, getArtist, getArtistSearch, getArtistTop } from '../controllers/deezer.controller';

const deezerRouter = Router();

deezerRouter.get('/search/artists', getArtistSearch);
deezerRouter.get('/artists/:artistId', getArtist);
deezerRouter.get('/artists/:artistId/top-tracks', getArtistTop);
deezerRouter.get('/artists/:artistId/albums', getAlbums);

export { deezerRouter };
