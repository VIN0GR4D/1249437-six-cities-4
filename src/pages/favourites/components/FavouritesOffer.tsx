import { FC } from 'react';
import { Link } from 'react-router-dom';
import { OFFER_URL } from '../../../const/links';
import { Offer } from '../../../types/offer';
import FavouriteButton from '../../../components/FavouriteButton';


export interface FavouritesOfferProps {
    offer: Offer;
}

export const FavouritesOffer: FC<FavouritesOfferProps> = ({ offer }) => (
  <article className="favorites__card place-card">
    <div className="favorites__image-wrapper place-card__image-wrapper">
      <Link to={`${OFFER_URL}/${offer.id}`}>
        <img
          className="place-card__image"
          src={offer.previewImage}
          width="150"
          height="110"
          alt="Place image"
        />
      </Link>
    </div>
    <div className="favorites__card-info place-card__info">
      <div className="place-card__price-wrapper">
        <div className="place-card__price">
          <b className="place-card__price-value">&euro;{offer.price}</b>
          <span className="place-card__price-text">
            &#47;&nbsp;night
          </span>
        </div>
        <FavouriteButton isFavourite={offer.isFavorite} id={offer.id}/>
      </div>
      <div className="place-card__rating rating">
        <div className="place-card__stars rating__stars">
          <span style={{ width: `${offer.rating * 20}%` }}></span>
          <span className="visually-hidden">Rating</span>
        </div>
      </div>
      <h2 className="place-card__name">
        <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
      </h2>
      <p className="place-card__type">{offer.type}</p>
    </div>
  </article>
);
