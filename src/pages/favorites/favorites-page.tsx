import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectOffersList } from '../../state/selectors';
import Header from '../../components/header/header-сomponent';
import MemoOffersForCity from './components/offers-for-city/memo-offers-for-city';
import { Offer } from '../../types/offer';
import { Link } from 'react-router-dom';
import { MAIN_URL } from '../../const/links';

export const FavoritesPage: FC = () => {
  const offers = useSelector(selectOffersList)?.filter((offer) => offer.isFavorite);
  const offersByCities = (offers || []).reduce<Record<string, Offer[]>>((acc, offer) => {
    const key = offer.city.name;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(offer);
    return acc;
  }, {});

  const isEmpty = !offers || offers.length === 0;

  return (
    <div className={`page ${isEmpty ? 'page--favorites-empty' : ''}`}>
      <Header />
      <main className={`page__main page__main--favorites ${isEmpty ? 'page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">
          {
            offers && offers.length ?
              <section className="favorites">
                <h1 className="favorites__title">Saved listing</h1>
                <ul className="favorites__list">
                  {Object.keys(offersByCities).map((city) => (
                    <MemoOffersForCity city={city} offers={offersByCities[city] ?? null } key={city}/>
                  ))}
                </ul>
              </section>
              :
              <section className="favorites favorites--empty">
                <h1 className="visually-hidden">Favorites (empty)</h1>
                <div className="favorites__status-wrapper">
                  <b className="favorites__status">Nothing yet saved.</b>
                  <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
                </div>
              </section>
          }
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={MAIN_URL}>
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </div>
  );
};
