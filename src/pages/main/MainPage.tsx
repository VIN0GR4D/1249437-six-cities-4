import { FC, useState } from 'react';
import OffersList from '../../components/offers/OffersList';
import { Map, MapPoint } from '../../components/Map';
import { City, Offer } from '../../types/offer';
import { offerToMapPoint } from '../../utils/offerToMapPoint';
import { CitiesTabs } from './components/CitiesTab';
import { CITIES_DATA } from '../../const/cities';
import { useSelector } from 'react-redux';
import { selectActiveOfferId, selectCurrentCity, selectOffersList } from '../../state/selectors';
import SortingSelect from './components/SortingSelect';
import { SortType } from './components/SortTypes';
import Spinner from '../../components/Spinner';
import Header from '../../components/Header';

const sortFunctions: Record<SortType, (a: Offer, b: Offer) => number> = {
  [SortType.LOW_PRICE_FIRST]: (a, b) => a.price - b.price,
  [SortType.HIGH_PRICE_FIRST]: (a, b) => b.price - a.price,
  [SortType.TOP_RATED_FIRST]: (a, b) => b.rating - a.rating,
  [SortType.POPULAR]: () => 1,
};

const MainPage: FC = () => {

  const [sortType, setSortType] = useState<SortType>(SortType.POPULAR);
  const city: City = useSelector(selectCurrentCity);
  const allOffers = useSelector(selectOffersList);
  const activeOfferId = useSelector(selectActiveOfferId);
  const offers = allOffers ? allOffers.filter((it) => it.city.name === city.name) : undefined;
  const sortedOffers = offers ? offers.sort(sortFunctions[sortType]) : [];
  const points: MapPoint[] = offers ? offers.map((offer: Offer) => offerToMapPoint(offer)) : [];

  return (
    <div className="page page--gray page--main">
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <CitiesTabs cities={CITIES_DATA}/>
        <div className="cities">
          <div className="cities__places-container container">
            {!offers ?
              <section className='cities__places places'
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Spinner sizeInPixels={100}/>
              </section>
              :
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found"> {offers.length ?? 0} places to stay in {city.name}</b>
                <SortingSelect onSortSelected={setSortType}/>
                <OffersList offers={sortedOffers} />
              </section>}
            <div className="cities__right-section">
              <section className="cities__map map">
                <Map city={city} points={points} selectedPointId={activeOfferId} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
