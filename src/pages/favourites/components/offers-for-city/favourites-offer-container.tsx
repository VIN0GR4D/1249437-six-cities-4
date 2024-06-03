import React from 'react';
import FavouritesOffer, { FavouritesOfferProps } from './favourites-offer';

const MemoFavouritesOffer = React.memo<FavouritesOfferProps>(FavouritesOffer, (prev, next) =>
  prev.offer.id === next.offer.id && prev.offer.isFavorite === next.offer.isFavorite
);

export default MemoFavouritesOffer;

