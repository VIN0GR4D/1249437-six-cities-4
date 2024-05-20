import { FC, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CommentForm } from './components/CommentForm';
import { CommentsList } from './components/CommentsList';
import { Map } from '../../components/Map';
import { offerToMapPoint } from '../../utils/offerToMapPoint';
import Header from '../../components/Header';
import { axiosInstance } from '../../api';
import { GET_COMMENTS, GET_OFFERS } from '../../const/apiConsts';
import { FullOfferInfo } from '../../types/fullOfferInfo';
import { Offer } from '../../types/offer';
import Spinner from '../../components/Spinner';
import { Comment } from '../../types/comment';
import NearbyOffersList from './components/NearbyOffersList';
import { useSelector } from 'react-redux';
import { selectAuthStatus, selectOffersList } from '../../state/selectors';
import { AuthStatus } from '../../types/authStatus';
import FavouriteButton from '../../components/FavouriteButton';
import { NOT_FOUND_URL } from '../../const/links';

const MAX_PREVIEW_IMAGES = 6;
const MAX_NEARBY_OFFERS = 3;
const PRO_HOST_CLASS = 'offer__avatar-wrapper--pro';

export const OfferPage: FC = () => {
  const { id } = useParams();
  const allOffers = useSelector(selectOffersList);
  const navigate = useNavigate();
  const [offerInfo, setOfferInfo] = useState<FullOfferInfo | undefined>(undefined);
  const [comments, setComments] = useState<Comment[] | undefined>(undefined);
  const [nearbyOffers, setNearbyOffers] = useState<Offer[] | undefined>(undefined);
  const authStatus = useSelector(selectAuthStatus);

  const getComments = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Comment[]>(`${GET_COMMENTS}/${id}`);
      setComments(response.data);
    } catch (err) {
      navigate(NOT_FOUND_URL);
    }
  }, [id, navigate]);

  const getOfferInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get<FullOfferInfo>(`${GET_OFFERS}/${id}`);
      setOfferInfo(response.data);
    } catch (err) {
      navigate(NOT_FOUND_URL);
    }
  }, [id, navigate]);

  const getNearbyOffers = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Offer[]>(`${GET_OFFERS}/${id}/nearby`);
      setNearbyOffers(response.data.slice(0, Math.min(MAX_NEARBY_OFFERS, response.data.length)));
    } catch (err) {
      navigate(NOT_FOUND_URL);
    }
  }, [id, navigate]);

  useEffect(() => {
    getOfferInfo();
    getNearbyOffers();
    getComments();
  }, [id, allOffers, getComments, getNearbyOffers, getOfferInfo]);

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        {offerInfo ?
          <section className="offer">
            <div className="offer__gallery-container container">
              <div className="offer__gallery">
                {offerInfo.images.slice(0, Math.min(offerInfo.images.length, MAX_PREVIEW_IMAGES)).map((image) =>
                  (
                    <div className="offer__image-wrapper" key={image}>
                      <img
                        className="offer__image"
                        src={image}
                        alt="Photo studio"
                      />
                    </div>)
                )}
              </div>
            </div>
            <div className="offer__container container">
              <div className="offer__wrapper">
                <div className="offer__mark" hidden={!offerInfo.isPremium}>
                  <span>Premium</span>
                </div>
                <div className="offer__name-wrapper">
                  <h1 className="offer__name">
                    {offerInfo.title}
                  </h1>
                  <FavouriteButton id={offerInfo.id}
                    isFavourite={offerInfo.isFavorite}
                    stylePrefix={'offer'}
                    width={31}
                    height={33}
                  />
                </div>
                <div className="offer__rating rating">
                  <div className="offer__stars rating__stars">
                    <span style={{ width: `${Math.round(offerInfo.rating) * 20}%` }}></span>
                    <span className="visually-hidden">Rating</span>
                  </div>
                  <span className="offer__rating-value rating__value">{offerInfo.rating}</span>
                </div>
                <ul className="offer__features">
                  <li className="offer__feature offer__feature--entire">
                    {offerInfo.type}
                  </li>
                  <li className="offer__feature offer__feature--bedrooms">
                    {offerInfo.bedrooms} Bedroom{offerInfo.bedrooms !== 1 ? 's' : ''}
                  </li>
                  <li className="offer__feature offer__feature--adults">
                    Max {offerInfo.maxAdults} adult{offerInfo.maxAdults !== 1 ? 's' : ''}
                  </li>
                </ul>
                <div className="offer__price">
                  <b className="offer__price-value">&euro;{offerInfo.price}</b>
                  <span className="offer__price-text">&nbsp;night</span>
                </div>
                <div className="offer__inside">
                  <h2 className="offer__inside-title">What&apos;s inside</h2>
                  <ul className="offer__inside-list">
                    {offerInfo.goods.map((good) => <li className="offer__inside-item" key={good}>{good}</li>)}
                  </ul>
                </div>
                <div className="offer__host">
                  <h2 className="offer__host-title">Meet the host</h2>
                  <div className="offer__host-user user">
                    <div className={`offer__avatar-wrapper ${offerInfo.host.isPro ? PRO_HOST_CLASS : ''} user__avatar-wrapper`}>
                      <img
                        className="offer__avatar user__avatar"
                        src={offerInfo.host.avatarUrl}
                        width="74"
                        height="74"
                        alt="Host avatar"
                      />
                    </div>
                    <span className="offer__user-name">{offerInfo.host.name}</span>
                    <span className="offer__user-status">{offerInfo.host.isPro ? 'Pro' : ''}</span>
                  </div>
                  <div className="offer__description">
                    <p className="offer__text">
                      {offerInfo.description}
                    </p>
                  </div>
                </div>
                <section className="offer__reviews reviews">
                  <CommentsList reviews={comments} />
                  {
                    authStatus === AuthStatus.AUTHORIZED ?
                      <CommentForm offerId={offerInfo.id} afterFormSend={() => {
                        getComments();
                      }}
                      />
                      :
                      <div />
                  }
                </section>
              </div>
            </div>
            {
              nearbyOffers ?
                <section className="offer__map map" style={{width: '800px', marginLeft: 'auto', marginRight: 'auto'}}>
                  <Map
                    city={offerInfo.city}
                    points={[...nearbyOffers, offerInfo].map((it) => offerToMapPoint(it))}
                    selectedPointId={offerInfo.id}
                  />
                </section>
                :
                <Spinner sizeInPixels={100}/>
            }
          </section>
          :
          <Spinner sizeInPixels={100}/>}
        {
          nearbyOffers !== undefined && offerInfo !== undefined ?
            <div className="container">
              <section className="near-places places">
                <NearbyOffersList offers={nearbyOffers} />
              </section>
            </div>
            :
            <div/>
        }
      </main>
    </div>
  );
};
